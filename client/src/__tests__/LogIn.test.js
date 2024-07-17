import { MemoryRouter } from "react-router-dom";
import LogIn from "../components/LogIn";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { act } from 'react';
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { HeaderContext } from "../App";

describe("Login", () => {
    describe("non-server errors", () => {
        const mockSetHeaderContext = { setHeaderUpdate: () => null }
        it("shows error when email is blank", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockSetHeaderContext}>
                            <LogIn />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                )
            })

            await act(async () => {
                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("Email cannot be left blank.")).toBeInTheDocument();
            })
        });

        it("shows error when password is blank", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockSetHeaderContext}>
                            <LogIn />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                )
            })

            await act(async () => {
                userEvent.type(screen.getByLabelText("Email:"), "email");
                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("Please provide a password.")).toBeInTheDocument();
            })
        });
    });

    describe("server errors", () => {

        let mock;

        beforeEach(() => {
            mock = new MockAdapter(axios);
        })

        afterEach(() => {
            mock.reset();
        })

        const mockSetHeaderContext = { setHeaderUpdate: () => null }


        it("shows error when email is invalid", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockSetHeaderContext}>
                            <LogIn />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                )
            })

            mock.onPost("https://hhobackend.onrender.com/api/v1/users/login").reply(400, { errors: [{ msg: "PLEASE enter a VALID email" }] });
            await act(async () => {
                userEvent.type(screen.getByLabelText("Email:"), "invalid-email-format");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("PLEASE enter a VALID email"));
            })
        });

        it("shows error when user doesn't exist", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockSetHeaderContext}>
                            <LogIn />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                )
            })

            mock.onPost("https://hhobackend.onrender.com/api/v1/users/login").reply(404, { error: "user doesn't exist" });
            await act(async () => {
                userEvent.type(screen.getByLabelText("Email:"), "email@email.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("user doesn't exist")).toBeInTheDocument();
            })
        });

        it("shows error when password is incorrect", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockSetHeaderContext}>
                            <LogIn />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                )
            })

            mock.onPost("https://hhobackend.onrender.com/api/v1/users/login").reply(401, { error: "password is incorrect" });
            await act(async () => {
                userEvent.type(screen.getByLabelText("Email:"), "email@email.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("password is incorrect")).toBeInTheDocument();
            })
        });

        it("shows error when unknown error occurs", async () => {

            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockSetHeaderContext}>
                            <LogIn />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                )
            })

            mock.onPost("https://hhobackend.onrender.com/api/v1/users/login").reply(500, {});
            await act(async () => {
                userEvent.type(screen.getByLabelText("Email:"), "email@email.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("Log In Failed.")).toBeInTheDocument();
            })
        });

        it("shows error when server error occurs", async () => {

            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockSetHeaderContext}>
                            <LogIn />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                )
            })

            mock.onPost("https://hhobackend.onrender.com/api/v1/users/login").reply(500, { error: "server error" });
            await act(async () => {
                userEvent.type(screen.getByLabelText("Email:"), "email@email.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("server error")).toBeInTheDocument();
            })

        })

        it("shows error when server is down", async () => {

            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockSetHeaderContext}>
                            <LogIn />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                )
            })

            await act(async () => {
                userEvent.type(screen.getByLabelText("Email:"), "email@email.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("Log In Failed.")).toBeInTheDocument();
            })


        });
    });
    describe("success", () => {

        let mock;

        beforeEach(() => {
            mock = new MockAdapter(axios);
        })

        afterEach(() => {
            mock.reset();
        })

        const mockSetHeaderContext = { setHeaderUpdate: () => null }

        it("shows success message when log in is successful", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <HeaderContext.Provider value={mockSetHeaderContext}>
                            <LogIn />
                        </HeaderContext.Provider>
                    </MemoryRouter>
                )
            })

            mock.onPost("https://hhobackend.onrender.com/api/v1/users/login").reply(200, { "message": "let us go" });
            await act(async () => {
                userEvent.type(screen.getByLabelText("Email:"), "email@email.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("Log In Successful")).toBeInTheDocument();
            })
        });
    })
})