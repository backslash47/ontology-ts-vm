import { initOng } from './ong/ong';
import { initOnt } from './ont/ont';

export function init() {
  initOnt();
  initOng();
}
