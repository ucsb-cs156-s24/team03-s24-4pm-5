import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures, ucsbDatesFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("RecommendatonRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <RecommendatonRequestForm />
            </Router>
        );
        await screen.findByText(/Requester Email/);
        await screen.findByText(/Professor Email/);
        await screen.findByText(/Explanation/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a RecommendationRequest", async () => {

        render(
            <Router  >
                <RecommendatonRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest} />
            </Router>
        );
        await screen.findByTestId(/RecommendatonRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendatonRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <RecommendatonRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendatonRequestForm-requesterEmail");
        const requesterEmailField = screen.getByTestId("UCSBDateForm-requesterEmail");
        const professorEmailField = screen.getByTestId("UCSBDateForm-professorEmail");
        const explanationField = screen.getByTestId("UCSBDateForm-explanation");
        const dateRequestedField = screen.getByTestId("UCSBDateForm-dateRequested");
        const dateNeededField = screen.getByTestId("UCSBDateForm-dateNeeded");
        const doneField = screen.getByTestId("UCSBDateForm-done");
        const submitButton = screen.getByTestId("UCSBDateForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(professorEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(explanationField, { target: { value: 'bad-input' } });
        fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
        fireEvent.change(doneField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email is required./);
    });


    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <RecommendatonRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendatonRequestForm-submit");
        const submitButton = screen.getByTestId("RecommendatonRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email is required./);
        expect(screen.getByText(/Professor Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/DateRequested is required./)).toBeInTheDocument();
        expect(screen.getByText(/DateNeeded is required./)).toBeInTheDocument();
        expect(screen.getByText(/Done is required./)).toBeInTheDocument();

    });


    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <RecommendatonRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("RecommendatonRequestForm-requesterEmail");

        const requesterEmailField = screen.getByTestId("UCSBDateForm-requesterEmail");
        const professorEmailField = screen.getByTestId("UCSBDateForm-professorEmail");
        const explanationField = screen.getByTestId("UCSBDateForm-explanation");
        const dateRequestedField = screen.getByTestId("UCSBDateForm-dateRequested");
        const dateNeededField = screen.getByTestId("UCSBDateForm-dateNeeded");
        const doneField = screen.getByTestId("UCSBDateForm-done");
        const submitButton = screen.getByTestId("UCSBDateForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'student@ucsb.edu' } });
        fireEvent.change(professorEmailField, { target: { value: 'testprof@ucsb.edu' } });
        fireEvent.change(explanationField, { target: { value: 'test explanation' } });
        fireEvent.change(dateRequestedField, { target: { value: '2018-07-07T09:09:09' } });
        fireEvent.change(dateNeededField, { target: { value: '2018-07-09T09:09:09' } });
        fireEvent.change(doneField, { target: { value: 'true' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/DateRequested is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/DateNeeded is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Done is required./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <RecommendatonRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendatonRequestForm-cancel");
        const cancelButton = screen.getByTestId("RecommendatonRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});