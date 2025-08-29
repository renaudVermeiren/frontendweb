# Dossier

- Student: Renaud Vermeiren
- Studentennummer: 202301450
- E-mailadres: <renaud.vermeir@student.hogent.be>
- Demo: <[DEMO_LINK_HIER](https://hogent.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=5d23b6a6-ecf5-4b2d-a530-b33a00f39e93)>
- GitHub-repository: <https://github.com/HOGENT-frontendweb/frontendweb-2425-renaudVermeiren>
- Web Services:
  - Online versie: [LINK](https://frontendweb-2425-renaudvermeiren.onrender.com/)

## Logingegevens

### Lokaal

- Gebruikersnaam/e-mailadres: RenaudVermeiren / renaud.vermeiren@student.hogent.be
- Wachtwoord: 12345678

### Online

- Gebruikersnaam/e-mailadres: RenaudVermeiren / renaud.vermeiren@student.hogent.be
- Wachtwoord: 12345678



## Projectbeschrijving

Mijn api laat gebruikers toe om zelf electrische laadpalen te vinden in hun omgeving en om reservaties te maken bij deze laadpalen om hun auto op te laden. Ook kunnen gebruikers hun auto's toevoegen en beheren in deze applicatie. Er wordt ook verschillende info bijgehouden over de soort laadpalen en hun type connector zodat de gebruiker de juiste kan kieze die bij hem past.

## API calls

Er is ook een swagger.html file op github om de website versie van swagger te bekijken.


### Address
- `GET /api/address`: alle adressen ophalen
- `POST /api/address`: nieuw adres aanmaken
- `GET /api/address/:id`: adres met een bepaald id ophalen
- `PUT /api/address/:id`: adres met een bepaald id updaten
- `DELETE /api/address/:id`: adres met een bepaald id verwijderen

### Car
- `GET /api/cars`: alle auto's ophalen
- `POST /api/cars`: nieuwe auto aanmaken
- `GET /api/cars/:id`: auto met een bepaald id ophalen
- `PUT /api/cars/:id`: auto met een bepaald id updaten
- `DELETE /api/cars/:id`: auto met een bepaald id verwijderen

### ChargingStation
- `GET /api/chargingStations`: alle laadstations ophalen
- `POST /api/chargingStations`: nieuw laadstation aanmaken
- `GET /api/chargingStations/:id`: laadstation met een bepaald id ophalen
- `PUT /api/chargingStations/:id`: laadstation met een bepaald id updaten
- `DELETE /api/chargingStations/:id`: laadstation met een bepaald id verwijderen
- `GET /api/chargingStations/:id/EVChargers`: alle EV-laders van een laadstation ophalen

### City
- `GET /api/city`: alle steden ophalen
- `POST /api/city`: nieuwe stad aanmaken
- `GET /api/city/:id`: stad met een bepaald id ophalen
- `PUT /api/city/:id`: stad met een bepaald id updaten
- `DELETE /api/city/:id`: stad met een bepaald id verwijderen

### EVChargers
- `GET /api/EVChargers`: alle EV-laders ophalen
- `POST /api/EVChargers`: nieuwe EV-lader aanmaken
- `GET /api/EVChargers/:id`: EV-lader met een bepaald id ophalen
- `PUT /api/EVChargers/:id`: EV-lader met een bepaald id updaten
- `DELETE /api/EVChargers/:id`: EV-lader met een bepaald id verwijderen

### FavoriteChargingStations
- `GET /favoriteChargingStations`: alle favoriete laadstations van de ingelogde gebruiker ophalen
- `POST /favoriteChargingStations`: favoriet laadstation toevoegen voor de ingelogde gebruiker
- `GET /favoriteChargingStations/:id`: favoriet laadstation met een bepaald id ophalen
- `PUT /favoriteChargingStations/:id`: favoriet laadstation met een bepaald id updaten
- `DELETE /favoriteChargingStations/:id`: favoriet laadstation met een bepaald id verwijderen

### Reservations
- `GET /api/reservations`: alle reserveringen ophalen
- `POST /api/reservations`: nieuwe reservering aanmaken
- `GET /api/reservations/:id`: reservering met een bepaald id ophalen
- `PUT /api/reservations/:id`: reservering met een bepaald id updaten
- `DELETE /api/reservations/:id`: reservering met een bepaald id verwijderen

### Sessions
- `POST /api/sessions`: inloggen

### Users
- `GET /users/:id/cars`: auto's van een gebruiker ophalen
- `GET /users/:id/favoriteChargingStations`: favoriete laadstations van een gebruiker ophalen
- `POST /users/:id/favoriteChargingStations`: favoriet laadstation toevoegen voor een gebruiker
- `DELETE /users/:id/favoriteChargingStations/:station_id`: favoriet laadstation van een gebruiker verwijderen
- `GET /users/:id/reservations`: reserveringen van een gebruiker ophalen
- `GET /users`: alle gebruikers ophalen (admin)
- `POST /users`: nieuwe gebruiker registreren
- `GET /users/:id`: gebruiker met een bepaald id ophalen
- `PUT /users/:id`: gebruiker met een bepaald id updaten
- `DELETE /users/:id`: gebruiker met een bepaald id verwijderen (admin)

## Behaalde minimumvereisten



### Web Services

#### Datalaag

- [x] voldoende complex en correct (meer dan één tabel (naast de user tabel), tabellen bevatten meerdere kolommen, 2 een-op-veel of veel-op-veel relaties)
- [x] één module beheert de connectie + connectie wordt gesloten bij sluiten server
- [x] heeft migraties - indien van toepassing
- [x] heeft seeds

#### Repositorylaag

- [x] definieert één repository per entiteit - indien van toepassing
- [x] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing
- [x] er worden kindrelaties opgevraagd (m.b.v. JOINs) - indien van toepassing

#### Servicelaag met een zekere complexiteit

- [x] bevat alle domeinlogica
- [x] er wordt gerelateerde data uit meerdere tabellen opgevraagd
- [x] bevat geen services voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [x] bevat geen SQL-queries of databank-gerelateerde code

#### REST-laag

- [x] meerdere routes met invoervalidatie
- [x] meerdere entiteiten met alle CRUD-operaties
- [x] degelijke foutboodschappen
- [x] volgt de conventies van een RESTful API
- [x] bevat geen domeinlogica
- [x] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [x] degelijke autorisatie/authenticatie op alle routes

#### Algemeen

- [x] er is een minimum aan logging en configuratie voorzien
- [x] een aantal niet-triviale én werkende integratietesten (min. 1 entiteit in REST-laag >= 90% coverage, naast de user testen)
- [x] node_modules, .env, productiecredentials... werden niet gepushed op GitHub
- [x] minstens één extra technologie die we niet gezien hebben in de les
- [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
- [x] de applicatie start zonder problemen op gebruikmakend van de instructies in de README
- [x] de API draait online
- [x] duidelijke en volledige README.md
- [x] er werden voldoende (kleine) commits gemaakt
- [x] volledig en tijdig ingediend dossier

## Projectstructuur

### Web Services

een src map met daarin verschillende mappen. De core map voor alle core-functie van de app zoals authenticatie, validatie, service error logging en JWT. Een map rest met alle endpoints van de API met de juiste route en validatie schema's. 

## Extra technologie

### Web Services

De extra technologie dat ik gekozen heb was om een andere package gebruikt voor de invoer te valideren. In de cursus gebruiken we JOI maar ik heb gekozen voor [Zod](https://zod.dev/). Een Typescript-first schema validation met static type inference. Het werkt een beetje op de zelfde manier als JOI. Ik hb voor alle endpoints een schema moeten schrijven waarin gedefineerd wordt wat de API verwacht van invoer. En als de invoer niet klopt dan wordt er een gepaste foutmelding gegeven. 

## Gekende bugs

 Wanneer twee requests tegelijk schrijven naar dezelfde resource is er nog geen locking op transaction waardoor je soms data kunt lezen die er niet meer is.

## Reflectie

Ik vond dit project interessant en leerzaam. Het gaf me de kans om een volledige API op te zetten, endpoints te documenteren en na te denken over de backend-logica. Wat ik ook heel interessant vond was het gebruik van prisma. Normaal als ik met databanken werk schrijf ik zelf sql om de tabellen aan te maken enzo. Maar via prisma kon ik eerst een schema schrijven en daarna werd de sqp-code om de databank aan te maken automatisch gegenereerd voor mij. Wat wel super handig was. Ook omdat prisma met migratie werkt was het heel makkelijk om de databank aante passen en moest ik niet telkens manueel de code uitvoeren om mijn databank te updaten maar kon ik gewoon het schema aanpassen en dan een migratie doen. Ook vond ik het interessant om voor de eerste keer een echt robuust authenticatie systeem te maken voor mijn programma. Hierdoor heb ik meer inzicht over wat er achter de schermen allemaal gebeurt wanneer een gebruiken zich ergens inlogt.  

Soms voelde de scope van het project wat groot aan, maar dankzij de overzichtelijke cursus kon ik makkelijk het stappen plan volgen om zo stap voor stap het project te bouwen.

