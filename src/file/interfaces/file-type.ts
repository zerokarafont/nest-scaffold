/**
 * 对象存储服务
 */
export enum UploadType {
  /**
   * 本地存储
   */
  LOCAL = 'local',
  /**
   * 去中心化存储
   * 默认集成Pinata的IPFS服务
   */
  IPFS = 'ipfs',
  /**
   * 去中心化存储
   */
  ARWEAVE = 'arweave',
  /**
   * 七牛云
   */
  QINIU_CLOUD = 'qiniu_cloud',
  /**
   * 阿里云
   */
  ALI_CLOUD = 'ali_cloud',
  /**
   * 腾讯云
   */
  TENCENT_CLOUD = 'tencent_cloud',
}
