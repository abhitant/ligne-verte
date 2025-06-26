
# HimpactPoints Smart Contract

Smart contract pour gérer les points Himpact sur la blockchain Celo.

## 🎯 Fonctionnalités

- ✅ Attribution de points par l'admin (`assignPoints`)
- ✅ Déduction de points (`deductPoints`) 
- ✅ Consultation du solde (`getPoints`)
- ✅ Opérations en lot (batch)
- ✅ Système de pause d'urgence
- ✅ Gestion des erreurs et récupération de fonds

## 🚀 Déploiement

### Prérequis
```bash
npm install
```

### Variables d'environnement
Créez un fichier `.env`:
```
PRIVATE_KEY=your-private-key-here
CELOSCAN_API_KEY=your-celoscan-api-key
```

### Déploiement sur Alfajores (testnet)
```bash
npm run deploy:alfajores
```

### Déploiement sur Celo Mainnet
```bash
npm run deploy:mainnet
```

## 🔧 Utilisation depuis Supabase Edge Function

```javascript
// Dans votre Edge Function
const contract = new ethers.Contract(contractAddress, abi, signer);

// Attribuer des points après validation d'un signalement
await contract.assignPoints(userAddress, 10);

// Consulter le solde
const points = await contract.getPoints(userAddress);
```

## 📱 Adresses importantes

- **Alfajores Testnet**: [À remplir après déploiement]
- **Celo Mainnet**: [À remplir après déploiement]

## 🔐 Sécurité

- Seul l'owner peut attribuer/déduire des points
- Fonction de pause d'urgence
- Protection contre la reentrancy
- Validation des paramètres d'entrée

## 🧪 Tests avec Remix

1. Ouvrez [Remix IDE](https://remix.ethereum.org)
2. Copiez le code du contrat `HimpactPoints.sol`
3. Compilez avec Solidity 0.8.19
4. Connectez-vous au réseau Celo Alfajores
5. Déployez le contrat
