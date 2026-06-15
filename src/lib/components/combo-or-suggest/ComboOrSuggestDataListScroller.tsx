import {LoaderIcon} from 'lucide-react';
import {Component, createRef} from 'react';

import {valueAsNumber} from '@/utils/helper';

import type {CSSProperties, ReactNode, RefObject} from 'react';

type TProps = {
  children: ReactNode;
  limit?: number;
  loadMoreData?: (offset: number) => void;
  style: CSSProperties;
};

type TStateScroller = {
  isLoading: boolean;
  isScrolling: boolean;
  lastScrollMillis?: number;
  offset: number;
};

const SCROLL_TIMEOUT = 200; // If we don't get a scroll event within 200 ms, assume the user stopped scrolling.

class ComboOrSuggestDataListScroller extends Component<TProps, Partial<TStateScroller>> {
  refHtmlDivScroller: RefObject<HTMLDivElement | null>;

  scrollInterval: {id?: number; waitingMillis: number};

  constructor(props: TProps) {
    super(props);
    this.refHtmlDivScroller = createRef();
    this.scrollInterval = {id: undefined, waitingMillis: SCROLL_TIMEOUT / 2}; // Precista estar declarado dentro da classe
    this.state = {
      isLoading: false,
      isScrolling: false,
      lastScrollMillis: undefined,
      offset: 0,
    };
  }

  componentDidMount() {
    const tagDom = this.refHtmlDivScroller.current;
    if (!tagDom) return;
    tagDom.addEventListener('scroll', this.handleScroll);
    this.scrollInterval.id = window.setInterval(this.checkScroll, this.scrollInterval.waitingMillis);
    tagDom.scrollTop = 0; // precisa resetar, o Firefox não reseta
  }

  componentWillUnmount() {
    this.refHtmlDivScroller.current?.removeEventListener('scroll', this.handleScroll);
    window.clearInterval(this.scrollInterval.id);
  }

  /**
   * Verifica se houve atividade de scroll dentro do intervalo SCROLL_TIMEOUT, se não houve seta os states pra false
   */
  checkScroll = () => {
    if (Date.now() - valueAsNumber(this.state.lastScrollMillis || 0) > SCROLL_TIMEOUT && this.state.isScrolling) {
      this.setState({
        isLoading: false,
        isScrolling: false,
      });
    }
  };

  handleScroll = () => {
    const {limit, loadMoreData} = this.props;
    if (limit && typeof loadMoreData === 'function') {
      const state: Partial<TStateScroller> = {
        isLoading: false,
        lastScrollMillis: Date.now(),
      };
      if (this.state.isScrolling === false) {
        state.isScrolling = true;
      }
      const tagDom = this.refHtmlDivScroller.current;
      if (!tagDom) return;
      const scrollTop = Math.round(tagDom.scrollTop); // how much has been scrolled
      const height = tagDom.offsetHeight; // height of the element (se houver borda, precisa ser com border-box)
      const {scrollHeight} = tagDom; // height of the content of the element
      if (scrollTop + height >= scrollHeight) {
        state.offset = valueAsNumber(this.state.offset || 0) + limit;
        state.isLoading = true;
        loadMoreData(state.offset);
      }
      this.setState(state);
    }
  };

  renderLoading() {
    if (!this.state.isLoading) return;
    return (
      <div className="absolute bottom-0 flex w-full justify-center bg-blue-100 opacity-50">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  render() {
    const {children, style} = this.props;
    return (
      <div className="h-full overflow-auto" ref={this.refHtmlDivScroller} style={style}>
        {children}
        {this.renderLoading()}
      </div>
    );
  }
}

export default ComboOrSuggestDataListScroller;
