import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/restaurantUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function MenuItemReviewTable({
    reviews,
    currentUser,
    testIdPrefix = "MenuItemReviewTable" }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/menuItemReviews/edit/${cell.row.values.id}`)
    };

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/menuItemReviews/all"]
    );

    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); };

    const columns = [
        {
            Header: 'ID',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Item ID',
            accessor: 'itemId',
        },
        {
            Header: 'Reviewer Email',
            accessor: 'reviewerEmail',
        },
        {
            Header: 'Stars',
            accessor: 'stars',
        },
        {
            Header: 'Date Reviewed',
            accessor: 'dateReviewed',
        },
        {
            Header: 'Comments',
            accessor: 'comments',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    } 

    return <OurTable
        data={reviews}
        columns={columns}
        testid={testIdPrefix}
    />;
};
