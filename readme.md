# Ordresystem besåtende af upload af lydfiler og ordreflow

* CRUD - Skab, læs, opdatere, slet ordrer
* Relationsdata mellem ordre, deres indindtalinger & kommentarer
* M.E.R.N. Stack (MongoDB, Express, Reactjs og Node.js)
* Autentificering og brugersystem med forskellige tillader (Administrator, producer etc.)

## Formål

Formålet med dette system er at skabe et nemt overblik over sine indtalingsordrer fra kunder.

## *Front-end*

Frontenden består af en REACT-app som gør brug af mange dens egenskaber såsom:
- React Router
- React API proxy
- React PrivateRoute component
- Asynchronous logic with loading
- File uploading

**Alle siderne bruger samtidig en fælles søgefilter algoritme som gør brug af regex**

```javascript
export function searchFilter(criteria, row) {
    if (/^\d+$/.test(criteria)) {
        if (row.OrdreId === parseInt(criteria)) {
            return true
        } else {
            return false;
        }
    } else if (criteria.length > 0) {
        criteria = criteria.toLowerCase();
        if (row.Virksomhed.toLowerCase().includes(criteria) || row.Kundenavn.toLowerCase().includes(criteria) || row.ValgteSpeaker.toLowerCase().includes(criteria)) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}
```

## *Back-end*

Frontenden består af en Node.js server som kører på express frameworket og gør brug af mongoose til at samarbejde med databasen.

Den består også af:
- Multer (Til at modtage formdata som indeholder de uploadede filers datastrømme)
- Mongoose (Et mongoDB & Node.js library der gør det lettere at vedligeholde forbindelse med fault tolerance & modelskemaer)
- Passport (Til at autorisere brugeren og udfylde req.user dataobjektet med brugerens informationer)

# Installation
### Forudsætninger
Nedenstående skal være installeret på systemet.
- [Git](https://git-scm.com/)
- [Nodejs](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [pm2](https://pm2.keymetrics.io/) (Process Manager)

### Opsætning
#### **1. Klon repository**

Da repostoriet er privat skal du bruge en git token givet af en author for at klone det ned på dit system.
Skab eller naviger hen til den mappe du gerne vil have applikationen bliver opbevaret.

Derefter skriver du:
```bash
git clone https://emilskovmand:<GitToken>@github.com/emilskovmand/Ordresystem-Relatel.git
```
#### **2. Installer dependencies**

Vær sikker på at være i root mappen af applikationen og derefter skriv disse ind og vær sikker på at være i den rigtige mappe:
```bash
~/Ordresystem-Relatel$ npm install

~/Ordresystem-Relatel$ cd .client/

~/Ordre-system-Relatel/client$ npm install
```

#### **3. Build React-app**

Vær sikker på at være i client mappen under root og skriv derefter:
```bash
~/Ordre-system-Relatel/client$ npm run build
```
Dette vil skabe en produktions klar react-app til ordresystemet

#### **4. Opsætning af miljøvariabler**

### Igennem Shell:
Inde i root mappen skal der skabes en *.env* fil som skal indeholde:

(Bemærk at dette er eksempler!)
```
DB_CONNECTION_STRING = mongodb+srv://<username>:<password>@realmcluster.cpuwi.mongodb.net/<MongoDB-Databasenavn>?retryWrites=true&w=majority
SECRET = EKGEZUjZ6efnRxOA3hey31SsE6wt9xWruMLzvM
- I nogle tilfælde skal der også tilføjes disse variabler:
NODE_ENV = production
PORT = <port> 
```
Port default: 3001

#### **5. Kør applikation**

pm2 er en proces manager som sørger for at holde applikationen igang; dvs. at i tilfælde, hvor appen crasher eller lignende vil pm2 starte applikationen igen.

For at starte systemet op for første gang:
```bash
(Bemærk: Vi er i root mappen af applikationen)
~/Ordre-system-Relatel$ pm2 start server.js
```
For at vise listen af apps registreret i din lokale proces manager:
```bash
~$ pm2 list
```
For at stoppe et system:
```bash
(Id kan ses i listen)
~$ pm2 stop <id>
```
For at starte et registreret system
```bash
(Id kan ses i listen)
~$ pm2 start <id>
```

Hvis du har problemer med opsætning må du gerne kontakte mig, jeg har erfaring i at opsætte systemet på Ubuntu/Linux.

## Udvikling
Kontakt author(s) vedrørende udvikling af systemet da det er beskyttet af en GNU General Public license.

## License
[GNU](https://www.gnu.org/licenses/gpl-3.0.html)

## Author
This tool is created by Emil Skovmand: email: emilskovmand@gmail.com
