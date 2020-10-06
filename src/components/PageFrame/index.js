export default class PageFrame {
  constructor(header, children, isLogin) {
    this.header = header;
    this.children = children;
  }

  render() {
    return `
      <div class='page-wrap'>
        <div class='content'>
          <div class='header'>
            ${this.header}
          </div>
         ${this.children}
        </div>
      </div>
    `;
  }
}