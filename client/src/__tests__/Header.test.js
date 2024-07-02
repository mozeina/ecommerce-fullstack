import { render, screen } from "@testing-library/react"
import Header from "../components/Header";
import { MemoryRouter } from "react-router-dom";


describe('Header', () => {
    it('renders title of the page', () => {
        render(
            <MemoryRouter >
                <Header />
            </MemoryRouter>
        )

        expect(screen.getByText(/Harry's Hair Oils/i)).toBeInTheDocument();
    })
});