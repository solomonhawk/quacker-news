import nProgress from 'nprogress';

const DELAY = 100;

let nProgressTimer: NodeJS.Timeout | null = null;

function reset() {
  if (nProgressTimer) {
    clearTimeout(nProgressTimer);
  }
}

export function start() {
  reset();
  nProgressTimer = setTimeout(() => nProgress.start(), DELAY);
}

export function finish() {
  reset();
  nProgress.done();
}
