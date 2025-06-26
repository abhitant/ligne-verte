
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title HimpactPoints
 * @dev Smart contract pour gérer les points Himpact sur Celo
 * @author La Ligne Verte
 */
contract HimpactPoints is Ownable, ReentrancyGuard, Pausable {
    
    // Mapping pour stocker les points de chaque utilisateur
    mapping(address => uint256) public points;
    
    // Mapping pour suivre le total des points attribués
    uint256 public totalPointsIssued;
    
    // Events
    event PointsAssigned(address indexed user, uint256 amount, uint256 newBalance);
    event PointsDeducted(address indexed user, uint256 amount, uint256 newBalance);
    event ContractPaused();
    event ContractUnpaused();
    
    /**
     * @dev Constructeur - définit le déployeur comme owner
     */
    constructor() {
        // Le déployeur devient automatiquement l'owner grâce à Ownable
    }
    
    /**
     * @dev Attribue des points à un utilisateur
     * @param user Adresse de l'utilisateur
     * @param amount Nombre de points à attribuer
     */
    function assignPoints(address user, uint256 amount) 
        external 
        onlyOwner 
        whenNotPaused 
        nonReentrant 
    {
        require(user != address(0), "HimpactPoints: Invalid user address");
        require(amount > 0, "HimpactPoints: Amount must be greater than 0");
        
        points[user] += amount;
        totalPointsIssued += amount;
        
        emit PointsAssigned(user, amount, points[user]);
    }
    
    /**
     * @dev Retire des points à un utilisateur
     * @param user Adresse de l'utilisateur
     * @param amount Nombre de points à retirer
     */
    function deductPoints(address user, uint256 amount) 
        external 
        onlyOwner 
        whenNotPaused 
        nonReentrant 
    {
        require(user != address(0), "HimpactPoints: Invalid user address");
        require(amount > 0, "HimpactPoints: Amount must be greater than 0");
        require(points[user] >= amount, "HimpactPoints: Insufficient points");
        
        points[user] -= amount;
        
        emit PointsDeducted(user, amount, points[user]);
    }
    
    /**
     * @dev Retourne le solde de points d'un utilisateur
     * @param user Adresse de l'utilisateur
     * @return Le nombre de points de l'utilisateur
     */
    function getPoints(address user) external view returns (uint256) {
        require(user != address(0), "HimpactPoints: Invalid user address");
        return points[user];
    }
    
    /**
     * @dev Attribue des points à plusieurs utilisateurs en une fois
     * @param users Tableau des adresses utilisateurs
     * @param amounts Tableau des montants correspondants
     */
    function batchAssignPoints(address[] calldata users, uint256[] calldata amounts) 
        external 
        onlyOwner 
        whenNotPaused 
        nonReentrant 
    {
        require(users.length == amounts.length, "HimpactPoints: Arrays length mismatch");
        require(users.length > 0, "HimpactPoints: Empty arrays");
        
        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != address(0), "HimpactPoints: Invalid user address");
            require(amounts[i] > 0, "HimpactPoints: Amount must be greater than 0");
            
            points[users[i]] += amounts[i];
            totalPointsIssued += amounts[i];
            
            emit PointsAssigned(users[i], amounts[i], points[users[i]]);
        }
    }
    
    /**
     * @dev Retourne les points de plusieurs utilisateurs
     * @param users Tableau des adresses à vérifier
     * @return Tableau des soldes correspondants
     */
    function batchGetPoints(address[] calldata users) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256[] memory balances = new uint256[](users.length);
        
        for (uint256 i = 0; i < users.length; i++) {
            balances[i] = points[users[i]];
        }
        
        return balances;
    }
    
    /**
     * @dev Permet de mettre en pause le contrat (sécurité)
     */
    function pause() external onlyOwner {
        _pause();
        emit ContractPaused();
    }
    
    /**
     * @dev Permet de reprendre le contrat
     */
    function unpause() external onlyOwner {
        _unpause();
        emit ContractUnpaused();
    }
    
    /**
     * @dev Retourne le nombre total de points émis
     */
    function getTotalPointsIssued() external view returns (uint256) {
        return totalPointsIssued;
    }
    
    /**
     * @dev Fonction d'urgence pour récupérer des tokens ERC20 envoyés par erreur
     * @param token Adresse du token à récupérer
     * @param amount Montant à récupérer
     */
    function emergencyWithdrawToken(address token, uint256 amount) 
        external 
        onlyOwner 
    {
        require(token != address(0), "HimpactPoints: Invalid token address");
        
        // Interface basique ERC20
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", owner(), amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "HimpactPoints: Token transfer failed");
    }
    
    /**
     * @dev Fonction d'urgence pour récupérer du CELO envoyé par erreur
     */
    function emergencyWithdrawCelo() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "HimpactPoints: No CELO to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "HimpactPoints: CELO transfer failed");
    }
}
