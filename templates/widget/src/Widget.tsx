import './styles/styles.scss';

export default class Widget extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="test">
      </div>
    `;
  }
}
