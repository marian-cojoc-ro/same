import _reduce from 'lodash/fp/reduce';
import _flatMap from 'lodash/fp/flatMap';
import _map from 'lodash/fp/map';

const cartesianProduct = (...arrays) => {
  return _reduce((a, b) => {
    return _flatMap(x => {
      return _map(y => {
        return x.concat([y])
      })(b)
    })(a)
  })([[]])(arrays)
};

export default cartesianProduct;
