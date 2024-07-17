import React, { act } from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Products from "../components/Products";
import { HeaderContext } from '../App';
import Cookies from 'js-cookie';

describe('Products page', () => {
    describe("basic", () => {
        let mock;
        const mockHeaderContextValue = { setHeaderUpdate: () => null };
        beforeEach(() => {
            mock = new MockAdapter(axios);
        });

        afterEach(() => {
            mock.reset();
        });

        it('displays products when loaded', async () => {
            mock.onGet("https://hhobackend.onrender.com/api/v1/products").reply(200, [
                {
                    description: "first items description",
                    id: 1,
                    img: "http://image.com/image1-png",
                    item_name: "first item",
                    price: "1",
                    stock: 100
                },
                {
                    description: "second item's description ",
                    id: 2,
                    img: "http://image.com/image2-png",
                    item_name: "second item",
                    price: "2",
                    stock: 200
                }
            ]);

            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockHeaderContextValue}>
                            <Products />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                );
            });

            await waitFor(() => {
                expect(screen.getByText('first items description')).toBeInTheDocument();
                expect(screen.getByText('second item')).toBeInTheDocument();
                expect(screen.getByText('Left in stock: 200')).toBeInTheDocument();
            });
        });

        it("shows error page when failed to fetch products", async () => {
            mock.onGet("https://hhobackend.onrender.com/api/v1/products").reply(500, null);

            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockHeaderContextValue}>
                            <Products />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                );
            });

            await waitFor(() => {
                expect(screen.getByText("There's been an error with fetching products...")).toBeInTheDocument();
            });
        });
    });
});
