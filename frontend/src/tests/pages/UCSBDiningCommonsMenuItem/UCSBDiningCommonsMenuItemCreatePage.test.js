import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import UCSBDiningCommonsMenuItemCreatePageStories from "stories/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage.stories";

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

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {

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
                    <UCSBDiningCommonsMenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /diningcommonsmenuitem", async () => {

        const queryClient = new QueryClient();
        const UCSBDiningCommonsMenuItem = {
            id: 3,
            name: "Spaghetti with Meatballs",
            diningCommonsCode: "Carrillo",
            station: "Italian Kitchen"   
        };

        axiosMock.onPost("/api/diningcommonsmenuitem/post").reply(202, UCSBDiningCommonsMenuItem);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

        const idInput = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
        const nameInput = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
        const diningCommonsCodeInput = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const stationInput = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(idInput, { target: { value: 3 } })
        fireEvent.change(nameInput, { target: { value: 'Spaghetti with Meatballs' } })
        fireEvent.change(diningCommonsCodeInput, { target: { value: 'Carrillo' } })
        fireEvent.change(stationInput, { target: { value: 'Italian Kitchen' } })

        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            id: "3",
            name: "Spaghetti with Meatballs",
            diningCommonsCode: "Carrillo",
            station: "Italian Kitchen"  
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New UCSBDiningCommonsMenuItem Created - id: 3 name: Spaghetti with Meatballs, diningCommonsCode: Carrillo, station: Italian Kitchen");
        expect(mockNavigate).toBeCalledWith({ "to": "/diningcommonsmenuitem" });

    });
});


