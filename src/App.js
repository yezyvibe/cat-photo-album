import Breadcrumb from "./components/Breadcrumb.js";
import Nodes from "./components/Nodes.js";
import ImageView from "./components/ImageView.js";
import Loading from "./components/Loading.js";
import { request } from "./utils/api.js";

const cache = {};

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
    // initialState: this.state.depth,
    initialState: [], // 빈 배열로 두는 이유?
    onClick: (index) => {
      if (index === null) {
        // root일때
        this.setState({
          ...this.state,
          depth: [],
          isRoot: true,
          nodes: cache.rootNodes,
        });
        return;
      }
      // 현재 디렉토리를 클릭한 경우
      if (index === this.state.depth.length - 1) {
        return;
      }

      // const nextState = { ...this.state };
      const nextDepth = this.state.depth.slice(0, index + 1);

      this.setState({
        ...this.state,
        depth: nextDepth,
        nodes: cache[nextDepth[nextDepth.length - 1].id],
      });
    },
  });

  const nodes = new Nodes({
    $app,
    initialState: [],
    onClick: async (node) => {
      try {
        this.setState({
          ...this.state,
          isLoading: true,
        });

        if (node.type === "DIRECTORY") {
          if (cache[node.id]) {
            this.setState({
              ...this.state,
              isRoot: false,
              depth: [...this.state.depth, node],
              nodes: cache[node.id],
              isLoading: false,
            });
          } else {
            const nextNodes = await request(node.id);
            this.setState({
              ...this.state,
              depth: [...this.state.depth, node],
              nodes: nextNodes,
              isLoading: false,
              isRoot: false,
            });
            cache[node.id] = nextNodes;
          }
        } else if (node.type === "FILE") {
          this.setState({
            ...this.state,
            selectedFilePath: node.filePath,
            isLoading: false,
            // isRoot: false
          });
        }
      } catch (e) {
        throw new Error(e.message);
      }
    },
    onBackClick: async () => {
      try {
        const nextState = { ...this.state };
        nextState.depth.pop();

        const prevNodeId =
          nextState.depth.length === 0
            ? null
            : nextState.depth[nextState.depth.length - 1].id;

        // this.setState({
        //   ...nextState
        // })

        if (prevNodeId === null) {
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: cache.rootNodes,
          });
        } else {
          this.setState({
            ...nextState,
            isRoot: false,
            nodes: cache[prevNodeId],
          });
        }
      } catch (err) {
        new Error(err.message);
      }
    },
  });

  const imageView = new ImageView({
    $app,
    initialState: this.state.selectedFilePath,
    modalClose: () => {
      this.setState({
        ...this.state,
        selectedFilePath: null,
      });
    },
  });

  const loading = new Loading({
    $app,
    initialState: this.state.isLoading,
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
        isRoot: true,
        isLoading: true,
      });
      const rootNodes = await request();
      this.setState({
        ...this.state,
        nodes: rootNodes,
        isRoot: true,
      });
      cache.rootNodes = rootNodes;
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
