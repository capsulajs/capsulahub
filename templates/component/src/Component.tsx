import './styles/styles.scss';

export default class Component extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="test">
      </div>
    `;
  }
}
