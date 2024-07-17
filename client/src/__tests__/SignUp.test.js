import React, { act } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '../components/SignUp';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';


describe("Sign Up", () => {
    describe("normal errors", () => {
        it('shows error when username is blank', async () => {
            render(
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            )

            await act(async () => {
                userEvent.click(screen.getByText("Submit"));
            })

            await waitFor(() => {
                expect(screen.getByText("Username cannot be left blank.")).toBeInTheDocument();
            })

        })
        it("shows error when email is left blank", async () => {
            render(
                <MemoryRouter >
                    <SignUp />
                </MemoryRouter>
            )

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username");
                userEvent.click(screen.getByText("Submit"));
            })


            await waitFor(() => {
                expect(screen.getByText("Email cannot be left blank.")).toBeInTheDocument();
            })

        })
        it("shows error when there is no password provided", async () => {
            render(
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            )

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username");
                userEvent.type(screen.getByLabelText(/Email:/i), "Email@gmail.com");
                userEvent.click(screen.getByText("Submit"));
            })


            await waitFor(() => {
                expect(screen.getByText("Please provide a password.")).toBeInTheDocument();
                expect(screen.queryByText("Email cannot be left blank.")).not.toBeInTheDocument();
            })
        })
        it("shows error when password isn't confirmed", async () => {
            render(
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            )

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username");
                userEvent.type(screen.getByLabelText(/Email:/i), "Email@gmail.com");
                userEvent.type(screen.getByLabelText("Password:"), "Password");
                userEvent.click(screen.getByText("Submit"));
            });


            await waitFor(() => {
                expect(screen.getByText("Please confirm your password.")).toBeInTheDocument();
                expect(screen.queryByText("Please provide a password.")).not.toBeInTheDocument();
            })

        })
        it("shows error when password and confirmed password do not match", async () => {
            render(
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            )

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username");
                userEvent.type(screen.getByLabelText(/Email:/i), "email@gmail.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.type(screen.getByLabelText(/Confirm Password:/i), "password2");

                userEvent.click(screen.getByText("Submit"));

            })

            await waitFor(() => {
                expect(screen.queryByText("Please confirm your password.")).not.toBeInTheDocument();
                expect(screen.getByText("Provided passwords do not match.")).toBeInTheDocument();
            })
        })
    })



    //now for the httpRequest errors

    describe("http request errors", () => {
        let mock;

        beforeEach(() => {
            mock = new MockAdapter(axios);
        })

        afterEach(() => {
            mock.reset();
        })

        it("shows error when username is less than 3 characters long", async () => {
            render(
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            )

            mock.onPost("https://hhobackend.onrender.com/api/v1/users/register").reply(400, { errors: [{ "msg": "test error for username less than 3 characters" }] });

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "us");
                userEvent.type(screen.getByLabelText(/Email:/i), "email@gmail.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.type(screen.getByLabelText(/Confirm Password:/i), "password1");
                userEvent.click(screen.getByText("Submit"));
            })

            await waitFor(() => {
                expect(screen.getByText("test error for username less than 3 characters")).toBeInTheDocument();
            })
        })

        it("shows error when email is not a valid email", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <SignUp />
                    </MemoryRouter>
                )
            })

            mock.onPost('https://hhobackend.onrender.com/api/v1/users/register').reply(400, { errors: [{ "msg": "Invalid email bro" }] });

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username");
                userEvent.type(screen.getByLabelText(/Email:/i), "invalidemail");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.type(screen.getByLabelText(/Confirm Password:/i), "password1");
                userEvent.click(screen.getByText("Submit"));
            })

            await waitFor(() => {
                expect(screen.getByText("Invalid email bro")).toBeInTheDocument();
            })

        })

        it("shows error when password is less than 6 characters long", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <SignUp />
                    </MemoryRouter>
                )
            })

            mock.onPost('https://hhobackend.onrender.com/api/v1/users/register').reply(400, { errors: [{ "msg": "password must be atleast 6 characters long" }] });

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username");
                userEvent.type(screen.getByLabelText(/Email:/i), "invalidemail");
                userEvent.type(screen.getByLabelText("Password:"), "pas");
                userEvent.type(screen.getByLabelText(/Confirm Password:/i), "pas");
                userEvent.click(screen.getByText("Submit"));
            })

            await waitFor(() => {
                expect(screen.getByText("password must be atleast 6 characters long"));
            });
        })

        it("shows erorr when password has spaces", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <SignUp />
                    </MemoryRouter>
                )
            })

            mock.onPost('https://hhobackend.onrender.com/api/v1/users/register').reply(400, { errors: [{ "msg": "password must NOT include spaces" }] });

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username");
                userEvent.type(screen.getByLabelText(/Email:/i), "invalidemail");
                userEvent.type(screen.getByLabelText("Password:"), "pas word bro");
                userEvent.type(screen.getByLabelText(/Confirm Password:/i), "pas word bro");
                userEvent.click(screen.getByText("Submit"));
            })

            await waitFor(() => {

                expect(screen.getByText("password must NOT include spaces"));
            });
        })

        it("shows error when user already exists", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <SignUp />
                    </MemoryRouter>
                )
            })

            mock.onPost('https://hhobackend.onrender.com/api/v1/users/register').reply(409, { error: "user is already in the database" });

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username1");
                userEvent.type(screen.getByLabelText(/Email:/i), "email1@gmail.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.type(screen.getByLabelText(/Confirm Password:/i), "password1");
                userEvent.click(screen.getByText("Submit"));
            })

            await waitFor(() => {
                expect(screen.getByText("user is already in the database"));
            });
        });

        it("shows error when unknown error happens ", async () => {
            await act(async () => {
                render(
                    <MemoryRouter>
                        <SignUp />
                    </MemoryRouter>
                )
            })

            mock.onPost('https://hhobackend.onrender.com/api/v1/users/register').reply(500, {});

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username1");
                userEvent.type(screen.getByLabelText(/Email:/i), "email1@gmail.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.type(screen.getByLabelText(/Confirm Password:/i), "password1");
                userEvent.click(screen.getByText("Submit"));
            })

            await waitFor(() => {
                expect(screen.getByText("Registration Failed.")).toBeInTheDocument();
            });
        })

        it("shows error when server is down", async () => {

            await act(async () => {
                render(
                    <MemoryRouter>
                        <SignUp />
                    </MemoryRouter>
                )
            })

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username1");
                userEvent.type(screen.getByLabelText(/Email:/i), "email1@gmail.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.type(screen.getByLabelText(/Confirm Password:/i), "password1");
                userEvent.click(screen.getByText("Submit"));
            })

            await waitFor(() => {
                expect(screen.getByText("Registration Failed.")).toBeInTheDocument();
            });

        })
    })

    describe("success", () => {
        let mock;

        beforeEach(() => {
            mock = new MockAdapter(axios);
        })

        afterEach(() => {
            mock.reset();
        })

        it("success message appears when successful registration", async () => {

            await act(async () => {
                render(
                    <MemoryRouter>
                        <SignUp />
                    </MemoryRouter>
                )
            })

            mock.onPost('https://hhobackend.onrender.com/api/v1/users/register').reply(201, {}, { "auth-token": "dummy-token" });

            await act(async () => {
                userEvent.type(screen.getByLabelText(/Username:/i), "username");
                userEvent.type(screen.getByLabelText(/Email:/i), "email@gmail.com");
                userEvent.type(screen.getByLabelText("Password:"), "password1");
                userEvent.type(screen.getByLabelText(/Confirm Password:/i), "password1");
                userEvent.click(screen.getByText("Submit"));
            })

            await waitFor(() => {
                expect(screen.getByText("Signed Up Successfully")).toBeInTheDocument();
            });
        })
    })
});