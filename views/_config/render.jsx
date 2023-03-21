import { h, Fragment, render } from "preact";
import { useState, useMemo } from "preact/hooks";
import "../style.css";
import styles from "./config.module.css";
import i18n from "../../i18n/config.yml";
import { Advanced } from "./advanced";
import { Bibliography } from "./bibliography";
import { General } from "./general";
import { Graph } from "./graph";
import { LinkTypes } from "./linkTypes";
import { Metas } from "./metas";
import { RecordsFilter } from "./recordsFilter";
import { RecordTypes } from "./recordTypes";
import { Views } from "./views";

const rootNode = document.getElementById("root");
render(<App />, rootNode);

function App() {
  const [page, setPage] = useState("general");

  const opts = useMemo(() => {
    return window.api.getConfigOptions();
  }, []);

  const router = {
    general: General,
    record_types: RecordTypes,
    link_types: LinkTypes,
    graph: Graph,
    metas: Metas,
    bibliography: Bibliography,
    views: Views,
    records_filter: RecordsFilter,
    advanced: Advanced,
  };

  const Page = router[page];

  return (
    <>
      <Menu page={page} setPage={setPage} />
      <main>
        <Page opts={opts} />
      </main>
    </>
  );
}

function Menu({ page, setPage }) {
  const flag = "fr";

  return (
    <nav>
      <ul>
        <li tabindex="0" onClick={() => setPage("general")}>
          <span class="ico">web</span>
          {i18n.nav.general[flag]}
        </li>

        <li tabindex="0" onClick={() => setPage("record_types")}>
          <span class="ico">bubble_chart</span>
          {i18n.nav.record_types[flag]}
        </li>

        <li tabindex="0" onClick={() => setPage("link_types")}>
          <span class="ico">power_input</span>
          {i18n.nav.link_types[flag]}
        </li>

        <li tabindex="0" onClick={() => setPage("graph")}>
          <span class="ico">polyline</span>
          {i18n.nav.graph[flag]}
        </li>

        <li tabindex="0" onClick={() => setPage("metas")}>
          <span class="ico">label</span>
          {i18n.nav.metas[flag]}
        </li>

        <li tabindex="0" onClick={() => setPage("bibliography")}>
          <span class="ico">collections_bookmark</span>
          {i18n.nav.bibliography[flag]}
        </li>

        <li tabindex="0" onClick={() => setPage("views")}>
          <span class="ico">dvr</span>
          {i18n.nav.views[flag]}
        </li>

        <li tabindex="0" onClick={() => setPage("records_filter")}>
          <span class="ico">filter_alt</span>
          {i18n.nav.records_filter[flag]}
        </li>

        <li tabindex="0" onClick={() => setPage("advanced")}>
          <span class="ico">tune</span>
          {i18n.nav.advanced[flag]}
        </li>
      </ul>
    </nav>
  );
}
