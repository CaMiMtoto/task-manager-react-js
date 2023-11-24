import {Outlet} from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import {Container} from "react-bootstrap";

export default function AppLayout() {
    return (
        <div>
            <NavBar/>
            <Container className="py-4">
                <Outlet/>
            </Container>
        </div>
    );
}