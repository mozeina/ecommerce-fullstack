import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import About from '../components/About';

describe('About page', () => {
    test('renderes about us text', () => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>
        )
        expect(screen.getByText('Passion for Healthy Hair (Established in 2024)')).toBeInTheDocument(); 

    })
})
