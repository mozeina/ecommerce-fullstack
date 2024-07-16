/* we want to test: 
getting the cart
remove item from cart
checkout
*/

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Cookies from "js-cookie";
import Cart from "../components/Cart";
import React, { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";


describe("cart", () => {

    describe("empty cart success", () => {
        let mock;
        beforeEach(() => {
            mock = new MockAdapter(axios);
            Cookies.set("auth-token", "dummy-token");

            mock.onGet("http://localhost:6543/api/v1/cart").reply(200, { message: "empty cart" });
        })

        afterEach(() => {
            mock.reset();
            Cookies.remove("auth-token");
        })


        it("shows cart is empty when fetch is successful and cart is empty", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <Cart />
                    </MemoryRouter>
                )
            })

            await waitFor(() => {
                expect(screen.getByText("Your Cart :")).toBeInTheDocument();
                expect(screen.getByText("empty cart")).toBeInTheDocument();
            })
        })
    });

    describe("cart success", () => {
        let mock;
        beforeEach(() => {
            mock = new MockAdapter(axios);
            Cookies.set("auth-token", "dummy-token");

            mock.onGet("http://localhost:6543/api/v1/cart").reply(200, {
                cart_items: [
                    {
                        id: 1,
                        img: 'link/to/img1',
                        item_name: "First oil",
                        price: "1",
                        quantity: 51,
                        total_item_price: "1"
                    },
                    {
                        id: 2,
                        img: 'link/to/img2',
                        item_name: "Second oil",
                        price: "2",
                        quantity: 2,
                        total_item_price: "2"
                    },
                    {
                        id: 3,
                        img: 'link/to/img3',
                        item_name: "Third oil",
                        price: "3",
                        quantity: 63,
                        total_item_price: "3"
                    },

                ],

                cart_total: 1000
            })


        })

        afterEach(() => {
            mock.reset();
            Cookies.remove("auth-token");
        })


        beforeAll(() => {
            jest.spyOn(window, "alert").mockImplementation(() => { });
        })
        afterAll(() => {
            window.alert.mockRestore();
        })

        it("renders shows cart on load when items are fetched and cart is not empty", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <Cart />
                    </MemoryRouter>
                )
            })

            await waitFor(() => {
                expect(screen.getByText("1) First oil")).toBeInTheDocument();
                expect(screen.getByText("2) Second oil")).toBeInTheDocument();
                expect(screen.getByText("3) Third oil")).toBeInTheDocument();
            })
        })

        it("decrements quantity when of cart item when clicked & quantity doesn't exceed stock", async () => {

            await act(async () => {
                render(
                    <MemoryRouter>
                        <Cart />
                    </MemoryRouter>
                )
            });

            mock.onGet("http://localhost:6543/api/v1/products/1").reply(200, {
                data: {
                    id: 1,
                    img: 'link/to/img1',
                    item_name: "First oil",
                    price: "1",
                    description: "item id = 1 description",
                    stock: 100
                }
            });

            mock.onGet("http://localhost:6543/api/v1/products/3").reply(200, {
                data: {
                    id: 3,
                    img: 'link/to/img3',
                    item_name: "First oil",
                    price: "3",
                    description: "item id = 3 description",
                    stock: 100
                }
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("arrow-down-1"));
                userEvent.click(screen.getByTestId("arrow-down-3"));
            })

            await waitFor(() => {
                expect(screen.getByText('Quantity: 50')).toBeInTheDocument();
                expect(screen.getByText("Quantity: 62")).toBeInTheDocument();
            });

        });

        it("increments quantity of cart items when clicked & quantity doesn't exceed stock", async () => {

            await act(async () => {
                render(
                    <MemoryRouter>
                        <Cart />
                    </MemoryRouter>
                )
            });


            mock.onGet("http://localhost:6543/api/v1/products/2").reply(200, {
                data: {
                    id: 2,
                    img: 'link/to/img2',
                    item_name: "Second oil",
                    price: "2",
                    description: "item id = 2 description",
                    stock: 100
                }
            });

            mock.onGet("http://localhost:6543/api/v1/products/3").reply(200, {
                data: {
                    id: 3,
                    img: 'link/to/img3',
                    item_name: "Third oil",
                    price: "3",
                    description: "item id = 3 description",
                    stock: 100
                }
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("arrow-up-2"));
                userEvent.click(screen.getByTestId("arrow-up-3"));

            });

            await waitFor(() => {
                expect(screen.getByText("Quantity: 3")).toBeInTheDocument();
                expect(screen.getByText("Quantity: 64")).toBeInTheDocument();
            })

        });

        it("removes item from cart on remove from cart click", async () => {

            await act(async () => {
                render(
                    <MemoryRouter>
                        <Cart />
                    </MemoryRouter>
                )
            });


            mock.onDelete("http://localhost:6543/api/v1/cart/removeFromCart/3").reply(202, { "message": "success" });
            mock.onDelete("http://localhost:6543/api/v1/cart/removeFromCart/2").reply(202, { "message": "success" });

            mock.onGet("http://localhost:6543/api/v1/cart").reply(200, {
                cart_items: [
                    {
                        id: 1,
                        img: 'link/to/img1',
                        item_name: "First oil",
                        price: "1",
                        quantity: 51,
                        total_item_price: "1"
                    }
                ],

                cart_total: 333
            })

            await waitFor(() => expect(screen.getByText("Your Cart :")).toBeInTheDocument());

            await act(async () => {
                userEvent.click(screen.getByTestId("remove-from-cart-2"));
                userEvent.click(screen.getByTestId("remove-from-cart-3"));
            });

            await waitFor(() => {
                expect(screen.queryByText("2) Second Oil")).not.toBeInTheDocument();
                expect(screen.queryByText("3) Thrd Oil")).not.toBeInTheDocument();
                expect(screen.getByText("333$")).toBeInTheDocument();
            });

        });

    });

    describe("cart errors", () => {
        let mock;
        beforeEach(() => {

            mock = new MockAdapter(axios);
            Cookies.set("auth-token", "dummy-token");

        })

        afterEach(() => {
            mock.reset();
            Cookies.remove("auth-token");
        })
    });

});

        