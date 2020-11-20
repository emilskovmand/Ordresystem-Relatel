

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
                <td><button type="button" className="button">Åben Ordre</button></td>
            </tr>
        </>
    )
}

export default function GodtkendtTilProduktion() {
    return (
        <>
            <div className="main_content">
                <div className="header">Velkommen til ordresystemet. Du er logget ind som: Relatel</div>

                <h2 className="info">Godkendt Til Produktion</h2>




                <input type="text" className="selector move space" placeholder="Søgeord..." />
                <button type="button" className="button">Søg</button>




                <table className="content-table info">
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
                            Status={"Godkendt Til Produktion"}
                        />
                    </tbody>
                </table>


                <div className="info">
                    <div>Hvis du oplever nogle problemer eller har spørgsmål, så kontakt os venligst på telefon: 71 99 18 14
                    eller
                    email: kontakt@hejfrede.dk</div>
                </div>

            </div>
        </>
    )
}