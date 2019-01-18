const isMatching = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.url && req.url != route.url) return false;
  return true;
};

class requestHandler {
  constructor() {
    this.routes = [];
  }

  use(handler) {
    this.routes.push({ handler });
  }

  post(url, handler) {
    this.routes.push({ method: 'POST', handler, url });
  }

  get(url, handler) {
    this.routes.push({ method: 'GET', handler, url });
  }

  handleRequest(req, res) {
    let matchingRoutes = this.routes.filter(route => isMatching(req, route));
    let remaing = [...matchingRoutes];
    let next = () => {
      let current = remaing[0];
      if (!current) return;
      remaing = remaing.slice(1);
      current.handler(req, res, next);
    };
    next();
  }
}
module.exports = requestHandler;
