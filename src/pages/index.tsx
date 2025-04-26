import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Index() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to /dashboard after the component mounts
        navigate('/dashboard');
    }, [navigate]);
    return (
        <></>
    );
}
