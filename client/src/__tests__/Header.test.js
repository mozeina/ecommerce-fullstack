import { render, screen } from "@testing-library/react"
import Header from "../components/Header";
import { MemoryRouter } from "react-router-dom";
import { HeaderContext } from "../App";

describe('Header', () => {
    it('renders title of the page', () => {
        const mockHeaderContextValue = { headerUpdate: false };
        render(
            <MemoryRouter >
                <HeaderContext.Provider value={mockHeaderContextValue}>
                    <Header />
                </HeaderContext.Provider>
            </MemoryRouter>
        )

        expect(screen.getByText(/Harry's Hair Oils/i)).toBeInTheDocument();
    })
});