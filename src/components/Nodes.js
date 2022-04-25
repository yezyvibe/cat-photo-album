export default function Nodes({ $app, initialState, onClick }) {
  this.state = initialState;

  this.$target = document.createElement("ul");
  this.$target.className = "Nodes";
  $app.appendChild(this.$target);

  this.onClick = onClick;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    if (this.state.nodes) {
      const nodesTemplate = this.state.nodes
        .map((node) => {
          const iconPath =
            node.type === "FILE"
              ? "./assets/file.png"
              : "./assets/directory.png";

          return `
          <div class="Node" data-node-id="${node.id}"><img src="${iconPath}"/><div>${node.name}</div></div>
        `;
        })
        .join("");
      this.$target.innerHTML = this.state.isRoot
        ? nodesTemplate
        : `<div class="Node"><img src="./assets/prev.png"/></div>${nodesTemplate}`;
    }
  };

  this.$target.addEventListener("click", (e) => {
    const $node = e.target.closest(".nav-item");
    const nodeId = $node.dataset;
    const selectedNode = this.state.nodes.find((node) => node.id === nodeId);

    if (selectedNode) {
      this.onClick(selectedNode);
    }
  });
}
