import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemTable from 'main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function UCSBDiningCommonsMenuItemIndexPage() {

    const currentUser = useCurrentUser();

    const { data: UCSBDiningCommonsMenuItem, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/UCSBDiningCommonsMenuItem/all"],
            { method: "GET", url: "/api/UCSBDiningCommonsMenuItem/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/UCSBDiningCommonsMenuItem/Create"
                    style={{ float: "right" }}
                >
                    Create UCSBDiningCommonsMenuItem
                </Button>
            )
        } 
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>UCSB Dining Commons Menu Items</h1>
                <UCSBDiningCommonsMenuItemTable UCSBDiningCommonsMenuItem={UCSBDiningCommonsMenuItem} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}