# OrdreSystem besåtende af upload af lydfiler og ordreflow

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


## Udvikling


## License
