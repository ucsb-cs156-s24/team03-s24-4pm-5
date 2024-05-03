const recommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requesterEmail": "cgaucho@ucsb.edu",
        "professorEmail": "phtcon@ucsb.edu",
        "explanation": "BS/MS Program",
        "dateRequested": "2024-04-30T22:17:57",
        "dateNeeded": "2024-04-30T22:18:57",
        "done": "false"
    },
    threeRecommendationRequests: [
        {
            "id": 2,
            "requesterEmail": "jason@ucsb.edu",
            "professorEmail": "test@ucsb.edu",
            "explanation": "MS Program",
            "dateRequested": "2024-04-30T22:17:50",
            "dateNeeded": "2024-04-30T22:18:51",
            "done": "false"
        },
        {
            "id": 3,
            "requesterEmail": "john@ucsb.edu",
            "professorEmail": "prof@ucsb.edu",
            "explanation": "PhD Program",
            "dateRequested": "2024-03-30T22:17:57",
            "dateNeeded": "2024-04-30T22:18:57",
            "done": "true"
        },
        {
            "id": 4,
            "requesterEmail": "bill@ucsb.edu",
            "professorEmail": "mirza@ucsb.edu",
            "explanation": "Scholarship Application",
            "dateRequested": "2022-06-30T22:17:57",
            "dateNeeded": "2024-04-30T22:18:57",
            "done": "false"
        }
    ]
};

export { recommendationRequestFixtures };