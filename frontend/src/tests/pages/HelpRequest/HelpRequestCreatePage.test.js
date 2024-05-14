import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
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

describe("HelpRequestCreatePage tests", () => {

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
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to quest", async () => {

        const queryClient = new QueryClient();

        const helpRequest = {
            id: 1,
            requesterEmail: "wwang@gmail.com",
            teamId: "2pm-2",
            tableOrBreakoutRoom: "15",
            requestTime: "2020-01-01T00:00",
            explanation: "generic explanation",
            solved: true
        }

        axiosMock.onPost("/apiquest/post").reply(202, helpRequest);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
        });

        const requesterEmailField = screen.getByLabelText("Requester Email");
        expect(requesterEmailField).toBeInTheDocument();

        const teamIdField = screen.getByLabelText("Team Id");
        expect(teamIdField).toBeInTheDocument();

        const tableOrBreakoutRoomField = screen.getByLabelText("Table Or Breakout Room");
        expect(tableOrBreakoutRoomField).toBeInTheDocument();

        const requestTimeField = screen.getByLabelText("Request Time (iso format)");
        expect(requestTimeField).toBeInTheDocument();

        const explanationField = screen.getByLabelText("Explanation");
        expect(explanationField).toBeInTheDocument();

        const solvedField = screen.getByLabelText("Solved");
        expect(solvedField).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(requesterEmailField, { target: { value: 'wwang@gmail.com' } })
        fireEvent.change(teamIdField, { target: { value: '2pm-2' } })
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '15' } })
        fireEvent.change(requestTimeField, { target: { value: '2020-01-01T00:00' } })
        fireEvent.change(explanationField, { target: { value: 'generic explanation' } })
        fireEvent.click(solvedField)

        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            requesterEmail: "wwang@gmail.com",
            teamId: "2pm-2",
            tableOrBreakoutRoom: "15",
            requestTime: "2020-01-01T00:00",
            explanation: "generic explanation",
            solved: true
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New help request Created - id: 1 requesterEmail: wwang@gmail.com");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

    });
});

