// packages/widgets/src/blocks/legacy-widget/edit/control.js
import apiFetch from "@wordpress/api-fetch";
import { debounce } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
var Control = class {
  /**
   * Creates and loads a new control.
   *
   * @access public
   * @param {Object}   params
   * @param {string}   params.id
   * @param {string}   params.idBase
   * @param {Object}   params.instance
   * @param {Function} params.onChangeInstance
   * @param {Function} params.onChangeHasPreview
   * @param {Function} params.onError
   */
  constructor({
    id,
    idBase,
    instance,
    onChangeInstance,
    onChangeHasPreview,
    onError
  }) {
    this.id = id;
    this.idBase = idBase;
    this._instance = instance;
    this._hasPreview = null;
    this.onChangeInstance = onChangeInstance;
    this.onChangeHasPreview = onChangeHasPreview;
    this.onError = onError;
    this.number = ++lastNumber;
    this.handleFormChange = debounce(
      this.handleFormChange.bind(this),
      200
    );
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.initDOM();
    this.bindEvents();
    this.loadContent();
  }
  /**
   * Clean up the control so that it can be garbage collected.
   *
   * @access public
   */
  destroy() {
    this.unbindEvents();
    this.element.remove();
  }
  /**
   * Creates the control's DOM structure.
   *
   * @access private
   */
  initDOM() {
    this.element = el("div", { class: "widget open" }, [
      el("div", { class: "widget-inside" }, [
        this.form = el("form", { class: "form", method: "post" }, [
          // These hidden form inputs are what most widgets' scripts
          // use to access data about the widget.
          el("input", {
            class: "widget-id",
            type: "hidden",
            name: "widget-id",
            value: this.id ?? `${this.idBase}-${this.number}`
          }),
          el("input", {
            class: "id_base",
            type: "hidden",
            name: "id_base",
            value: this.idBase ?? this.id
          }),
          el("input", {
            class: "widget-width",
            type: "hidden",
            name: "widget-width",
            value: "250"
          }),
          el("input", {
            class: "widget-height",
            type: "hidden",
            name: "widget-height",
            value: "200"
          }),
          el("input", {
            class: "widget_number",
            type: "hidden",
            name: "widget_number",
            value: this.idBase ? this.number.toString() : ""
          }),
          this.content = el("div", { class: "widget-content" }),
          // Non-multi widgets can be saved via a Save button.
          this.id && el(
            "button",
            {
              class: "button is-primary",
              type: "submit"
            },
            __("Save")
          )
        ])
      ])
    ]);
  }
  /**
   * Adds the control's event listeners.
   *
   * @access private
   */
  bindEvents() {
    if (window.jQuery) {
      const { jQuery: $ } = window;
      $(this.form).on("change", null, this.handleFormChange);
      $(this.form).on("input", null, this.handleFormChange);
      $(this.form).on("submit", this.handleFormSubmit);
    } else {
      this.form.addEventListener("change", this.handleFormChange);
      this.form.addEventListener("input", this.handleFormChange);
      this.form.addEventListener("submit", this.handleFormSubmit);
    }
  }
  /**
   * Removes the control's event listeners.
   *
   * @access private
   */
  unbindEvents() {
    if (window.jQuery) {
      const { jQuery: $ } = window;
      $(this.form).off("change", null, this.handleFormChange);
      $(this.form).off("input", null, this.handleFormChange);
      $(this.form).off("submit", this.handleFormSubmit);
    } else {
      this.form.removeEventListener("change", this.handleFormChange);
      this.form.removeEventListener("input", this.handleFormChange);
      this.form.removeEventListener("submit", this.handleFormSubmit);
    }
  }
  /**
   * Fetches the widget's form HTML from the REST API and loads it into the
   * control's form.
   *
   * @access private
   */
  async loadContent() {
    try {
      if (this.id) {
        const { form } = await saveWidget(this.id);
        this.content.innerHTML = form;
      } else if (this.idBase) {
        const { form, preview } = await encodeWidget({
          idBase: this.idBase,
          instance: this.instance,
          number: this.number
        });
        this.content.innerHTML = form;
        this.hasPreview = !isEmptyHTML(preview);
        if (!this.instance.hash) {
          const { instance } = await encodeWidget({
            idBase: this.idBase,
            instance: this.instance,
            number: this.number,
            formData: serializeForm(this.form)
          });
          this.instance = instance;
        }
      }
      if (window.jQuery) {
        const { jQuery: $ } = window;
        $(document).trigger("widget-added", [$(this.element)]);
      }
    } catch (error) {
      this.onError(error);
    }
  }
  /**
   * Perform a save when a multi widget's form is changed. Non-multi widgets
   * are saved manually.
   *
   * @access private
   */
  handleFormChange() {
    if (this.idBase) {
      this.saveForm();
    }
  }
  /**
   * Perform a save when the control's form is manually submitted.
   *
   * @access private
   * @param {Event} event
   */
  handleFormSubmit(event) {
    event.preventDefault();
    this.saveForm();
  }
  /**
   * Serialize the control's form, send it to the REST API, and update the
   * instance with the encoded instance that the REST API returns.
   *
   * @access private
   */
  async saveForm() {
    const formData = serializeForm(this.form);
    try {
      if (this.id) {
        const { form } = await saveWidget(this.id, formData);
        this.content.innerHTML = form;
        if (window.jQuery) {
          const { jQuery: $ } = window;
          $(document).trigger("widget-updated", [
            $(this.element)
          ]);
        }
      } else if (this.idBase) {
        const { instance, preview } = await encodeWidget({
          idBase: this.idBase,
          instance: this.instance,
          number: this.number,
          formData
        });
        this.instance = instance;
        this.hasPreview = !isEmptyHTML(preview);
      }
    } catch (error) {
      this.onError(error);
    }
  }
  /**
   * The widget's instance object.
   *
   * @access private
   */
  get instance() {
    return this._instance;
  }
  /**
   * The widget's instance object.
   *
   * @access private
   */
  set instance(instance) {
    if (this._instance !== instance) {
      this._instance = instance;
      this.onChangeInstance(instance);
    }
  }
  /**
   * Whether or not the widget can be previewed.
   *
   * @access public
   */
  get hasPreview() {
    return this._hasPreview;
  }
  /**
   * Whether or not the widget can be previewed.
   *
   * @access private
   */
  set hasPreview(hasPreview) {
    if (this._hasPreview !== hasPreview) {
      this._hasPreview = hasPreview;
      this.onChangeHasPreview(hasPreview);
    }
  }
};
var lastNumber = 0;
function el(tagName, attributes = {}, content = null) {
  const element = document.createElement(tagName);
  for (const [attribute, value] of Object.entries(attributes)) {
    element.setAttribute(attribute, value);
  }
  if (Array.isArray(content)) {
    for (const child of content) {
      if (child) {
        element.appendChild(child);
      }
    }
  } else if (typeof content === "string") {
    element.innerText = content;
  }
  return element;
}
async function saveWidget(id, formData = null) {
  let widget;
  if (formData) {
    widget = await apiFetch({
      path: `/wp/v2/widgets/${id}?context=edit`,
      method: "PUT",
      data: {
        form_data: formData
      }
    });
  } else {
    widget = await apiFetch({
      path: `/wp/v2/widgets/${id}?context=edit`,
      method: "GET"
    });
  }
  return { form: widget.rendered_form };
}
async function encodeWidget({ idBase, instance, number, formData = null }) {
  const response = await apiFetch({
    path: `/wp/v2/widget-types/${idBase}/encode`,
    method: "POST",
    data: {
      instance,
      number,
      form_data: formData
    }
  });
  return {
    instance: response.instance,
    form: response.form,
    preview: response.preview
  };
}
function isEmptyHTML(html) {
  const element = document.createElement("div");
  element.innerHTML = html;
  return isEmptyNode(element);
}
function isEmptyNode(node) {
  switch (node.nodeType) {
    case node.TEXT_NODE:
      return node.nodeValue.trim() === "";
    case node.ELEMENT_NODE:
      if ([
        "AUDIO",
        "CANVAS",
        "EMBED",
        "IFRAME",
        "IMG",
        "MATH",
        "OBJECT",
        "SVG",
        "VIDEO"
      ].includes(node.tagName)) {
        return false;
      }
      if (!node.hasChildNodes()) {
        return true;
      }
      return Array.from(node.childNodes).every(isEmptyNode);
    default:
      return true;
  }
}
function serializeForm(form) {
  return new window.URLSearchParams(
    Array.from(new window.FormData(form))
  ).toString();
}
export {
  Control as default
};
//# sourceMappingURL=control.mjs.map
