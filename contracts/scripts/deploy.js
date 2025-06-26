
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Déploiement du contrat HimpactPoints sur Celo...");
  
  // Récupérer le déployeur
  const [deployer] = await ethers.getSigners();
  console.log("📝 Déployeur:", deployer.address);
  
  // Vérifier le solde
  const balance = await deployer.getBalance();
  console.log("💰 Solde du déployeur:", ethers.utils.formatEther(balance), "CELO");
  
  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    console.warn("⚠️  Attention: Solde faible pour le déploiement");
  }
  
  // Déployer le contrat
  const HimpactPoints = await ethers.getContractFactory("HimpactPoints");
  const himpactPoints = await HimpactPoints.deploy();
  
  await himpactPoints.deployed();
  
  console.log("✅ Contrat HimpactPoints déployé à l'adresse:", himpactPoints.address);
  console.log("🔗 Hash de transaction:", himpactPoints.deployTransaction.hash);
  
  // Attendre quelques confirmations avant la vérification
  console.log("⏳ Attente de 5 confirmations...");
  await himpactPoints.deployTransaction.wait(5);
  
  console.log("📋 Informations de déploiement:");
  console.log("   - Contrat:", himpactPoints.address);
  console.log("   - Owner:", await himpactPoints.owner());
  console.log("   - Network:", (await ethers.provider.getNetwork()).name);
  
  // Sauvegarder l'adresse pour usage ultérieur
  console.log("\n🔐 Sauvegardez cette adresse de contrat:");
  console.log(himpactPoints.address);
  
  return himpactPoints.address;
}

main()
  .then((address) => {
    console.log(`\n✨ Déploiement terminé avec succès!`);
    console.log(`📝 Adresse du contrat: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
  });
