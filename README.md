# mon-cloud-personnel-securis-

Projet pour développer mes connaissances à faire du réseau informatique et aussi pour approfondir le web avec back et front

## Compétences developpées

| Compétence                  | Technologies / Concepts                                   |
| ---------------------------- | --------------------------------------------------------- |
| Réseau informatique      | TCP/IP, ports, DNS, IP, SSH, pare-feu, NAT, etc.          |
| Outils réseau          | `ping`,`netstat`,`curl`,`nc`,`iptables`,`ssh` |
| Architecture web          | Client / Serveur, HTTP, REST, API, reverse proxy          |
| Base de données SQL    | MySQL ou PostgreSQL pour comptes utilisateurs             |
| Base de données NoSQL    | MongoDB pour stocker les métadonnées fichiers           |
| Sécurité                | HTTPS, hash de mot de passe, authentification             |
| Frontend                  | HTML, CSS, JavaScript (vanilla ou petit framework)        |
| Backend                   | PHP ou Node.js (selon préférence)                       |
| Virtualisation et Réseau | Docker, bridge network, port mapping, firewall            |
| Déploiement            | Nginx, SSH, nom de domaine local (ex:`moncloud.local`)  |

## Structure du projet (progressive en 5 étapes)

### Étape 1 : Base système et réseau

* Créer deux VMs ou conteneurs (serveur & client)
* Tester la connectivité : `ping`, `traceroute`, `ssh`, `scp`
* Ajouter un nom local via `/etc/hosts` : `moncloud.local`
* Installer un serveur web (nginx ou apache)
* Comprendre les  **ports ouverts** , **pare-feu (UFW/iptables)**

### Étape 2 : Backend avec PHP ou Node.js

* Créer une API REST simple :
  * Authentification utilisateur
  * Upload de fichier (avec nom, type, taille)
  * Listing des fichiers
* Base SQL (MySQL ou SQLite) pour la gestion des utilisateurs

### Étape 3 : Frontend simple

* HTML/CSS/JS (sans framework pour apprendre les bases)
* Formulaire d’inscription/connexion
* Interface d’upload et liste des fichiers avec lien de téléchargement
* Appels JS à ton API (AJAX / `fetch()`)

### Étape 4 : Base NoSQL pour les métadonnées

* Utiliser MongoDB (ou autre NoSQL) pour stocker :
  * Historique d’upload
  * Logs réseau
  * Métadonnées utilisateurs

### Étape 5 : Sécurité + Déploiement

* Hasher les mots de passe (bcrypt ou autre)
* Passer ton site en HTTPS avec un certificat auto-signé
* Configurer un reverse proxy nginx
* Tester pare-feu, ports ouverts, redirections
* Déployer sur une VM distante ou serveur local

### Bonus

* Ajouter une **authentification 2FA**
* Générer des **liens de téléchargement temporaire**
* Créer un **dashboard admin**
* Ajouter **WebSocket** pour voir l’état des uploads en temps réel

## Technologies utilisées

| Côté           | Outils                                                                          |
| ---------------- | ------------------------------------------------------------------------------- |
| Backend          | PHP (avec Slim ou Laravel) ou Node.js (Express)                                 |
| SQL              | MySQL, PostgreSQL, ou SQLite                                                    |
| NoSQL            | MongoDB                                                                         |
| Frontend         | HTML/CSS/JavaScript (vanilla ou petit framework style Alpine.js)                |
| Serveur          | Nginx ou Apache                                                                 |
| Outils réseau   | `netstat`,`ping`,`curl`,`dig`,`tcpdump`,`iptables`,`nmap`,`ssh` |
| Conteneurisation | Docker (et Docker Compose) pour la modularité                                  |
| OS recommandé   | Ubuntu Server 22.04 (VM ou WSL2/Docker)                                         |
