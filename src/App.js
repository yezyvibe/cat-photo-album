import Breadcrumb from "./components/Breadcrumb.js";
import Nodes from "./components/Nodes.js";
import ImageView from "./components/ImageView.js";
import Loading from "./components/Loading.js";
import { request } from "./utils/api.js";

export default function App($app) {
  this.state = {
    isRoot: true,
    depth: [],
    nodes: [],
    selectedFilePath: null,
    isLoading: false,
  };

  const breadcrumb = new Breadcrumb({
    $app,
    initialState: this.state.depth,
  });

  const nodes = new Nodes({
    $app,
    initialState: [],
    onClick: async (node) => {
      try {
        if (node.type === "DIRECTORY") {
          const nextNodes = await request(node.id);
          this.setState({
            ...this.state,
            depth: [...depth, node],
            nodes: nextNodes,
          });
        } else if (node.type === "FILE") {
          this.setState({
            ...this.state,
            selectedFilePath: node.filePath,
          });
        }
      } catch (e) {
        throw new Error(e.message);
      }
    },
  });

  const imageView = new ImageView({
    $app,
    initialState: {
      filePath: this.state.selectedFilePath,
    },
  });

  const loading = new Loading({
    $app,
    initialState: {
      isLoading: this.state.isLoading,
    },
  });

  this.setState = (nextState) => {
    this.state = nextState;
    breadcrumb.setState(this.state.depth);
    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });
    // this.render() 렌더링을 안하는 이유? 컴포넌트 개별적으로 렌더링이 진행되기 때문?
    imageView.setState(this.state.selectedFilePath);
    loading.setState(this.state.isLoading);
  };

  const init = async () => {
    try {
      this.setState({
        ...this.state,
        isLoading: true,
      });
      const rootNodes = await request();
      this.setState({
        ...this.state,
        nodes: rootNodes,
        isRoot: true,
      });
    } catch (e) {
      throw new Error(e.message);
    } finally {
      this.setState({
        ...this.state,
        isLoading: false,
      });
    }
  };

  init();
}
