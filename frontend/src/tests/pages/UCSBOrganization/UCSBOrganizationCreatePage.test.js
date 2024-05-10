import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /UCSBOrganization", async () => {

        const queryClient = new QueryClient();
        const UCSBOrganization = {
            orgCode: "CD",
            orgTranslationShort: "Coder",
            orgTranslation: "CoderSB",
            inactive: "false"
        };

        axiosMock.onPost("/api/UCSBOrganization/post").reply(202, UCSBOrganization);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("orgTranslationShort")).toBeInTheDocument();
        });

        const nameInput = screen.getByLabelText("orgTranslationShort");
        expect(nameInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("orgTranslation");
        expect(descriptionInput).toBeInTheDocument();

        const inactiveInput = screen.getByLabelText("inactive");
        expect(inactiveInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(nameInput, { target: { value: 'South Coast Deli' } })
        fireEvent.change(descriptionInput, { target: { value: 'Sandwiches and Salads' } })
        fireEvent.change(inactiveInput,{ target: { value: 'false' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
////////////////////////////////////////
        expect(axiosMock.history.post[0].params).toEqual({
            nameInput: "South Coast Deli",
            description: "Sandwiches and Salads"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New restaurant Created - id: 3 name: South Coast Deli");
        expect(mockNavigate).toBeCalledWith({ "to": "/restaurants" });

    });
});


