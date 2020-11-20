import { Link } from 'react-router-dom'

export default function Navigation() {
    return (
        <>
            <div class="sidebar">
                <img class="logo" src="/relatel_logo.png" alt="relatel_logo" />
                <h2>Ordresystem</h2>
                <ul>
                    <Link to='/'>
                        <li><p><i class="fas fa-medal"></i>Nye Ordre</p></li>
                    </Link>
                    <Link to='/godkendt'>
                        <li><p><i class="fas fa-microphone-alt"></i>Godkendt til Produktion</p></li>
                    </Link>
                    <Link to='/afventer'>
                        <li><p><i class="fas fa-assistive-listening-systems"></i>Godkend Produktion</p></li>
                    </Link>
                    <Link to='/færdigeordre'>
                        <li><p><i class="fas fa-check"></i>Færdige Ordre</p></li>
                    </Link>
                    <li><p><i class="fas fa-file-invoice"></i>Fakturering</p></li>
                    <li><p><i class="fas fa-trash-alt"></i>Papirkurv</p></li>
                </ul>
                <div class="bottom_icons">
                    <a href="/"><i class="fas fa-user-cog"></i></a>
                    <a href="/"><i class="fas fa-sign-out-alt"></i></a>
                </div>
            </div>
        </>
    )
}