function Row({ OrdreId, BestillingsDato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, Status }) {
    return (
        <>
            <tr>
                <td>{OrdreId}</td>
                <td>{BestillingsDato}</td>
                <td>{Virksomhed}</td>
                <td>{Kundenavn}</td>
                <td>{AntalIndtalinger}</td>
                <td>{ValgteSpeaker}</td>
                <td>{Status}</td>
                <td><button type="button" class="button">Åben Ordre</button></td>
            </tr>
        </>
    )
}

export default function FærdigeOrdre() {
    return (
        <>
            <div class="main_content">
                <div class="header">Velkommen til ordresystemet. Du er logget ind som: Relatel</div>

                <h2 class="info">Færdige Ordre</h2>




                <input type="text" class="selector move space" placeholder="Søgeord..." />
                <button type="button" class="button">Søg</button>




                <table class="content-table info">
                    <thead>
                        <tr>
                            <th>Ordre ID</th>
                            <th>Bestillingsdato</th>
                            <th>Virksomhed</th>
                            <th>Kundenavn</th>
                            <th>Antal Indtalinger</th>
                            <th>Valgte Speaker</th>
                            <th>Status</th>
                            <th>Ordre Information</th>
                        </tr>
                    </thead>

                    <tbody>

                        <Row
                            OrdreId={8208}
                            BestillingsDato={"29-10-2020 kl. 15:32"}
                            Virksomhed={"SAF PARTNERS ApS"}
                            Kundenavn={"Andreas Andersen"}
                            AntalIndtalinger={2}
                            ValgteSpeaker={"Neutral kvindestemme"}
                            Status={"Færdig & Sendt"}
                        />


                        <Row
                            OrdreId={8209}
                            BestillingsDato={"29-10-2020 kl. 15:32"}
                            Virksomhed={"SAF PARTNERS ApS"}
                            Kundenavn={"Andreas Andersen"}
                            AntalIndtalinger={2}
                            ValgteSpeaker={"Neutral kvindestemme"}
                            Status={"Færdig & Sendt"}
                        />

                        <Row
                            OrdreId={8210}
                            BestillingsDato={"29-10-2020 kl. 15:32"}
                            Virksomhed={"SAF PARTNERS ApS"}
                            Kundenavn={"Andreas Andersen"}
                            AntalIndtalinger={2}
                            ValgteSpeaker={"Neutral kvindestemme"}
                            Status={"Færdig & Sendt"}
                        />

                    </tbody>
                </table>

                <div class="info">
                    <button class="button">Indlæs flere</button>
                </div>

                <div class="info">
                    <div>Hvis du oplever nogle problemer eller har spørgsmål, så kontakt os venligst på telefon: 71 99 18 14
                    eller
                    email: kontakt@hejfrede.dk</div>
                </div>

            </div>
        </>
    )
}