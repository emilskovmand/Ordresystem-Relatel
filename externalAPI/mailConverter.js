const testString = 'Contact reconversion by submitting on HubSpot Form "Bestil danske \r\nindtalinger 25.06.20"\r\n\r\nContact reconversion by submitting on HubSpot Form "Bestil danske \r\nindtalinger 25.06.20"\r\nPage submitted on: <a \r\nhref="https://www.relatel.dk/bestil-dansk-indtaling \r\n<https://www.relatel.dk/bestil-dansk-indtaling>" target="_blank" \r\nstyle="text-decoration: none; color: #00a4bd;">Bestil dansk indtaling \r\nhos Relatel</a>VIRKSOMHED:\r\nNavn på virksomhed\r\nDIT FORNAVN:\r\nLea\r\nDIT EFTERNAVN:\r\nskriver\r\nDIN E-MAIL:\r\nlea@relatel.dk <mailto:lea@relatel.dk>\r\nVælg den stemme som passer bedst til jeres virksomhed.:\r\nFormel mandestemme\r\nStykprisen bliver billigere jo flere, du bestiller.:\r\n1 stk. 600 kr.\r\nINDTALING 1:\r\nDu har ringet til Lea, Alle vores medarbejdere er desværre optaget lige \r\ni øjeblikket. Bliv i røret og vi stiller stiller dig om til den første \r\nledige medarbejder.\r\nOBS. Har du et ord eller navn med en speciel udtale? Sæt hak her, og \r\nindtal ordet/navnet på 42 90 18 00 så sikrer du den korrekte udtale.:\r\nNo\r\nBestilling af indtaling er kun muligt for Relatels kunder. Læs om \r\nbehandling af personoplysninger i Relatels persondatameddelelse: \r\nhttps://www.relatel.dk/persondatameddelelse: \r\n<https://www.relatel.dk/persondatameddelelse:>\r\nJeg er allerede kunde hos Relatel\r\nCONTACT\r\nLea skriver\r\nCOMPANY\r\nLea Relatel\r\n\r\n'


function ConvertToOrder(mailString = "") {
    const mailStringPart = mailString.split('\r\n');

    console.log(mailStringPart);

    const customerObject = {
        mail: '',
        virksomhed: '',
        name: '',
        stemme: '',
        sprog: '',
        indtalinger: []
    }

    customerObject.mail = mailStringPart[mailStringPart.indexOf("DIN E-MAIL:") + 1].split('<mailto:')[0];
    customerObject.virksomhed = mailStringPart[mailStringPart.indexOf("DIT FORNAVN:") - 1];
    customerObject.stemme = mailStringPart[mailStringPart.indexOf("DIN E-MAIL:") + 3];
    customerObject.name = mailStringPart[mailStringPart.indexOf("DIT FORNAVN:") + 1] + " " + mailStringPart[mailStringPart.indexOf("DIT EFTERNAVN:") + 1];

    if (mailString.includes("bestil-dansk-indtaling")) {
        customerObject.sprog = 'Dansk'
    } else {
        customerObject.sprog = 'Engelsk'
    }

    function getSpeaks() {
        let increment = 0;
        let speaks = [];

        while (!mailStringPart[increment].includes("OBS.")) {

            if (mailStringPart[increment].includes("INDTALING")) {
                increment++;
                let currentString = "";

                while (!mailStringPart[increment].includes("INDTALING") || !mailStringPart[increment].includes("OBS.")) {
                    currentString += mailStringPart[increment];
                    increment++;
                    if (mailStringPart[increment].includes("OBS.")) break;
                }

                speaks.push(currentString);
            } else increment++;

            if (mailStringPart[-1] === mailStringPart[increment]) break;
        }

        return speaks;
    }

    customerObject.indtalinger = getSpeaks();

    return customerObject;
}


module.exports = ConvertToOrder;