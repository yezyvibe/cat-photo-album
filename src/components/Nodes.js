export default function Nodes({ $app, initialState, onClick, onBackClick }) {
  this.state = initialState;

  this.$target = document.createElement("ul");
  this.$target.className = "Nodes";
  $app.appendChild(this.$target);

  this.onClick = onClick;
  this.onBackClick = onBackClick;

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
  // 중간에 왜 렌더링하지?? 뒤로 가도 되나??
  this.render();

  this.$target.addEventListener("click", (e) => {
    const $node = e.target.closest(".Node");

    if ($node) {
      const { nodeId } = $node.dataset;

      if (!nodeId) {
        // 노드를 클릭하지 않았다는 것은 뒤로 가기를 눌렀다는 것
        this.onBackClick();
        return;
      }

      const selectedNode = this.state.nodes.find((node) => node.id === nodeId);
      if (selectedNode) {
        this.onClick(selectedNode);
      }
    }
  });
}
