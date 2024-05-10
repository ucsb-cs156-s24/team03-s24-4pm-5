import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBDiningCommonsMenuItem tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByText(/DiningCommonsCode/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a UCSBDiningCommonsMenuItem", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm initialContents={ucsbDiningCommonsMenuItemFixtures.oneMenuItem} />
            </Router>
        );
        await screen.findByTestId(/UCSBDiningCommonsMenuItemForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/UCSBDiningCommonsMenuItemForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");
        const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
        const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
        const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.change(idField);
        fireEvent.change(nameField, { target: { value: 'bad-input' } });
        fireEvent.change(diningCommonsCodeField, { target: { value: 'bad-input' } });
        fireEvent.change(stationField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);
        await screen.findByText(/Id is required./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-submit");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Name is required./);
        expect(screen.getByText(/DiningCommonsCode is required./)).toBeInTheDocument();
        expect(screen.getByText(/Station is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

        const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
        const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
        const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.change(idField, { target: { value: '1' } });
        fireEvent.change(nameField, { target: { value: 'Burito' } });
        fireEvent.change(diningCommonsCodeField, { target: { value: 'DLG' } });
        fireEvent.change(stationField, { target: { value: 'Mexican' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Name must be a string/)).not.toBeInTheDocument();
        expect(screen.queryByText(/DiningCommonsCode must be a string/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Station must be a string/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-cancel");
        const cancelButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


