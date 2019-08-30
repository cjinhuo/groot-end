export default interface GetSwaggerInterFace {
  /**
   * 根据swagger地址获取swagger的json
   *
   * @memberof GetSwaggerInterFace
   */
  getSwaggerWithUrl: (url: string) => object;
}
