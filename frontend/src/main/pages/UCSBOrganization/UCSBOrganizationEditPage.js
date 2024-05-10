import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from 'main/components/UCSBOrganization/UCSBOrganizationForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({storybook=false}) {
    let { orgCode } = useParams();

    const { data: UCSBOrganization, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/UCSBOrganization?orgCode=${orgCode}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/UCSBOrganization`,
                params: {
                    orgCode
                }
            }
        );

    const objectToAxiosPutParams = (UCSBOrganization) => ({
        url: "/api/UCSBOrganization",
        method: "PUT",
        params: {
            orgCode: UCSBOrganization.orgCode,
        },
        data: {
            orgTranslationShort: UCSBOrganization.orgTranslationShort,
            orgTranslation: UCSBOrganization.orgTranslation,
            inactive: UCSBOrganization.inactive
        }
    });

    const onSuccess = (UCSBOrganization) => {
        toast(`New UCSBOrganization Created - orgCode: ${UCSBOrganization.orgCode} orgTranslationShort: ${UCSBOrganization.orgTranslationShort} orgTranslation: ${UCSBOrganization.orgTranslation} inactive: ${UCSBOrganization.inactive}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/UCSBOrganization?orgCode=${orgCode}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/UCSBOrganization" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit UCSBOrganization</h1>
                {
                    UCSBOrganization && <UCSBOrganizationForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={UCSBOrganization} />
                }
            </div>
        </BasicLayout>
    )

}