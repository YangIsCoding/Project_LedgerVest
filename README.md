使用說明書

metamask跳出來的時候不要忘記設定成sepolia

1. 先下載下來

2. cd fundRaisingPlatform

3. npm i

4. touch .env

    4. go to ![](https://www.alchemy.com/) 創建一個帳戶，進入之後按create new app，填一填。choose chain 選ethereum。Activate service 什麼都不用選直接點create app. 複製Network URL

5. SEPOLIA_RPC=??? (這個就是以上的network URL 直接貼上)

6. PRIVATE_KEY=???（去metamask點帳戶詳情，把他複製到.env）

7. npx hardhat compile

8. npx hardhat test(先在本地跑跑看，這個不花sepolia eth)

9. npx hardhat run scripts/deploy.js --network sepolia（這個就是要部署到sepolia了，然後會自動將abi複製到前端，沒事你就先照著做就行了）

10. copy CampaignFactory address(部署後是部署一個factory，關於factory的概念開會會提到。這時候會吐出一個factory address複製他)

11. go to frontend

12. npm i

13. go back to fundRaising

14. npx hardhat console --network sepolia(這個就是用指令直接在factory裡面創面新campaign)


15. > const factory = await ethers.getContractAt("CampaignFactory", "your_factory_address");

16. > await factory.createCampaign(ethers.parseEther("0.0000000000000001"));



以上是調用smart contract的createCampaign()來創造一個Campaign, 他需要一個參數是設定最小貢獻（要大於這筆金額才可以成為contributor）

17. > await factory.getDeployedCampaigns();

18. npm run dev

19. go to  http://localhost:3000

20. see if 已部署的 Campaigns: 下面有東西

21. 點擊那一串地址

22. 輸入大於minimum 的錢，contribute看看