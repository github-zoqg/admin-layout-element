import request from '../request';

const INTERFACE = {
  // 接口管理
  appInterfaceInfo: '/v1/prt/openapi/appInterfaceInfo',
};

export const appInterfaceInfo = (params) => {
  return request.get(INTERFACE.appInterfaceInfo, { params });
};
