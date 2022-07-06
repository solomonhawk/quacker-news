import Router from 'next/router';
import nProgress from 'nprogress';

const DELAY = 100;

let nProgressTimer: NodeJS.Timeout | null = null;

function reset() {
  if (nProgressTimer) {
    clearTimeout(nProgressTimer);
  }
}

function start() {
  reset();
  nProgressTimer = setTimeout(() => nProgress.start(), DELAY);
}

function finish() {
  reset();
  nProgress.done();
}

Router.events.on('routeChangeStart', start);
Router.events.on('routeChangeError', finish);
Router.events.on('routeChangeComplete', finish);
