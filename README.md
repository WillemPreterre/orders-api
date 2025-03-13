## :test_tube: Tests
Exécuter les tests avec Jest :


## :bar_chart: Monitoring avec Prometheus & Grafana
- :satellite: **Prometheus** : [http://localhost:9099](http://localhost:9099)
- :bar_chart: **Grafana** : [http://localhost:3002](http://localhost:3002)
    - Identifiants par défaut : `admin / admin`

## :book: Endpoints de l’API
| Méthode | Endpoint | Description |
|---------|---------|-------------|
| **GET** | `/api/orders` | Récupère toutes les commandes |
| **POST** | `/api/orders` | Crée une commande |
| **GET** | `/api/orders/:id` | Récupère une commande par ID |
| **PUT** | `/api/orders/:id` | Met à jour une commande |
| **DELETE** | `/api/orders/:id` | Supprime une commande |


### **:six: Démarrer l’API en développement**
```bash
npm run dev  # ou yarn dev
```

## :test_tube: Tests
Exécuter les tests avec Jest :
```bash
npm test  # ou yarn test
```

## :tools: Technologies utilisées
- **Node.js** (API Backend)
- **MongoDB** (Base de données)
- **RabbitMQ** (Message Broker)
- **Prometheus / Grafana** (Monitoring)
- **Jest** (Tests unitaires et d’intégration)
- **Docker** (Conteneurisation)
# API Orders - Documentation

## :pushpin: Description
API Orders est une application Node.js avec MongoDB et RabbitMQ, conçue pour gérer des commandes, avec une implémentation des tests Jest et un monitoring via Prometheus et Grafana.

## :rocket: Installation & Démarrage

### **:one: Prérequis**
- **Node.js** (v18+ recommandé)
- **Docker & Docker Compose** (pour RabbitMQ, MongoDB, Prometheus, Grafana)
- **npm ou yarn**

### **:two: Cloner le dépôt**
```bash
git clone https://github.com/WillemPreterre/orders-api.git
```

### **:three: Configuration**
Créer un fichier `.env` à la racine et ajouter :
```ini
RABBITMQ_URL=
JWT_SECRET=
PORT=
MONGO_URI=
```

### **:four: Installer les dépendances**
```bash
npm install  # ou yarn install
```

### **:five: Lancer les services Docker (MongoDB, RabbitMQ, Prometheus, Grafana)**
```bash
docker-compose up -d
```

### **:six: Démarrer l’API en développement**


## :test_tube: Tests
Exécuter les tests avec Jest :

## :book: Endpoints de l’API
| Méthode | Endpoint | Description |
|---------|---------|-------------|
| **GET** | `/api/orders` | Récupère toutes les commandes |
| **POST** | `/api/orders` | Crée une commande |
| **GET** | `/api/orders/:id` | Récupère une commande par ID |
| **PUT** | `/api/orders/:id` | Met à jour une commande |
| **DELETE** | `/api/orders/:id` | Supprime une commande |

## :tools: Technologies utilisées
- **Node.js** (API Backend)
- **MongoDB** (Base de données)
- **RabbitMQ** (Message Broker)
- **Prometheus / Grafana** (Monitoring)
- **Jest** (Tests unitaires et d’intégration)
- **Docker** (Conteneurisation)