function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import template from 'formalist-standard-react';
import serialize from 'formalist-serialize-react';

/**
 * Recurse to find the first FORM that is a parent of `el`
 * @param  {Node} el Child node to check parents of
 * @return {Mixed} The parent node or false
 */
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
function findParentForm(el) {
  const parentNode = el.parentNode;
  if (parentNode) {
    if (parentNode.nodeName === 'FORM') {
      return parentNode;
    } else {
      return findParentForm(parentNode);
    }
  }
  return false;
}

/**
 * Simple wrapper to create the form outer
 */
class FormWrapper extends Component {
  constructor(props) {
    super(props);
    const {
      form
    } = this.props;
    const formState = form.getState();
    this.state = {
      formState,
      serialized: null
    };
  }
  componentDidMount() {
    const self = this;
    let formBusy = false;
    const {
      form,
      parentForm
    } = this.props;
    form.on('change', getState => {
      const formState = getState();
      this.setState({
        formState
      });
    });
    if (parentForm) {
      // Ensure the serialize data get written before we submit
      parentForm.addEventListener('submit', function onParentSubmit(e) {
        e.preventDefault();
        if (formBusy) return;
        const serialized = self.serializeForm();
        self.setState({
          serialized
        }, () => {
          // Create and dispatch a custom event that is cancelable
          const postSerializationEvent = new window.CustomEvent('postserialization', {
            detail: {
              serialized,
              originalEvent: e
            },
            cancelable: true
          });
          const succeeded = parentForm.dispatchEvent(postSerializationEvent);
          if (succeeded) {
            parentForm.submit();
          }
        });
      });
      // Enable/disable the form
      form.on('busy', () => {
        formBusy = true;
        parentForm.classList.add('form--busy');
      });
      form.on('idle', () => {
        formBusy = false;
        parentForm.classList.remove('form--busy');
      });
    }
  }
  serializeForm() {
    const {
      prefix
    } = this.props;
    const formState = this.props.form.getState();
    return serialize(formState.toJS(), {
      prefix
    });
  }
  render() {
    const {
      form
    } = this.props;
    const {
      serialized
    } = this.state;
    return /*#__PURE__*/_jsxDEV("div", {
      children: [form.render(), serialized]
    }, void 0, true);
  }
}
FormWrapper.propTypes = {
  form: PropTypes.object.isRequired,
  parentForm: PropTypes.object,
  prefix: PropTypes.string
};
const defaultOptions = {
  serializeBeforeParentSubmit: true
};
/**
 * Render formalist form
 * @param  {Element} el Element where the form will be mounted
 * @param  {AST} props.ast Formalist compatible abstract syntax tree
 * @param  {AST} props.prefix Formalist compatible abstract syntax tree
 */
export function initializeFormalist(el, props) {
  const options = Object.assign({}, defaultOptions, props);
  const configuredTemplate = template(null, options.config);
  const form = configuredTemplate(options.ast);
  const wrapperProps = {
    form,
    prefix: options.prefix
  };
  // Pass through the parent form if we want to bind the serialize
  if (options.serializeBeforeParentSubmit) {
    const parentForm = findParentForm(el);
    if (parentForm) {
      wrapperProps.parentForm = parentForm;
    }
  }

  // Create a function to call the actual DOM render
  function render() {
    ReactDOM.render(/*#__PURE__*/_jsxDEV(FormWrapper, _objectSpread({}, wrapperProps), void 0, false), el);
  }
  return {
    form,
    render
  };
}

/**
 * Viewloader compatible boot function
 */
export default function formalist(el, props) {
  const form = initializeFormalist(el, props);
  form.render();
}