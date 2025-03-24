import { ethers } from "ethers";
import factoryArtifact from "./abis/CampaignFactory.json";
import campaignArtifact from "./abis/Campaign.json";
import contractAddress from "./abis/contract-address.json";

/**
 * 取得 MetaMask (或其他注入式錢包) 的 Provider。
 * 若檢測不到 window.ethereum，則用預設 provider (例如 sepolia) 當備援。
 */
export function getProvider() {
  if (typeof window !== "undefined" && window.ethereum) {
    // 有安裝 MetaMask
    return new ethers.BrowserProvider(window.ethereum);
  } else {
    // 沒有安裝，可以改成 Infura/Alchemy RPC
    return ethers.getDefaultProvider("sepolia");
  }
}

/**
 * 取得 CampaignFactory 合約實例（只讀）
 */
export async function getFactoryContract() {
  const provider = getProvider();
  const factoryAddr = contractAddress.CampaignFactory;
  // 不需要 await provider，直接傳 provider
  const contract = new ethers.Contract(factoryAddr, factoryArtifact.abi, provider);
  return contract;
}

/**
 * 取得 CampaignFactory 合約實例（可發送交易）
 * - 先要請求使用者錢包授權
 */
export async function getFactoryContractWithSigner() {
  const provider = getProvider();
  // 這裡仍需 await，因為 send() 是 Promise
  await provider.send("eth_requestAccounts", []); 
  const signer = await provider.getSigner();

  const factoryAddr = contractAddress.CampaignFactory;
  const contract = new ethers.Contract(factoryAddr, factoryArtifact.abi, signer);
  return contract;
}

/**
 * 取得單一 Campaign 合約的只讀實例
 * @param {string} address - 該 Campaign 部署的合約地址
 */
export async function getCampaignContract(address) {
  const provider = getProvider();
  const contract = new ethers.Contract(address, campaignArtifact.abi, provider);
  return contract;
}

/**
 * 取得單一 Campaign 合約的可交易實例
 * @param {string} address - 該 Campaign 部署的合約地址
 */
export async function getCampaignContractWithSigner(address) {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(address, campaignArtifact.abi, signer);
  return contract;
}
