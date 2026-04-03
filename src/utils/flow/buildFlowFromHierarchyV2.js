import { MarkerType } from "reactflow";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 90;
const H_GAP = 70;
const V_GAP = 180;
const FIRST_LEVEL_V_GAP = 250;

/* -----------------------------
   HELPERS
----------------------------- */

const createNode = (id, type, data, x = 0, y = 0) => ({
    id,
    type,
    position: { x, y },
    data,
    draggable: true
});

const createEdge = (source, target) => ({
    id: `e-${source}-${target}`,
    source,
    target,
    type: "default",
    style: { stroke: '#b1b1b7', strokeWidth: 2 },
    animated: false,
    markerEnd: { type: MarkerType.ArrowClosed }
});

// Helper to check and resolve overlaps by shifting nodes down
const resolveOverlaps = (nodes) => {
    const adjusted = [...nodes];
    
    for (let i = 0; i < adjusted.length; i++) {
        for (let j = i + 1; j < adjusted.length; j++) {
            const node1 = adjusted[i];
            const node2 = adjusted[j];
            
            const dx = Math.abs(node1.position.x - node2.position.x);
            const dy = Math.abs(node1.position.y - node2.position.y);
            
            // Check if nodes overlap (with some padding)
            if (dx < NODE_WIDTH + 10 && dy < NODE_HEIGHT + 10) {
                // Shift the lower node further down
                if (node1.position.y <= node2.position.y) {
                    node2.position.y = node1.position.y + NODE_HEIGHT + 50;
                } else {
                    node1.position.y = node2.position.y + NODE_HEIGHT + 50;
                }
            }
        }
    }
    
    return adjusted;
};

/* -----------------------------
   MAIN BUILDER
----------------------------- */

export const buildFlowFromHierarchy = (data) => {
    
    // Safety check for data
    if (!data) {
        return { nodes: [], edges: [] };
    }

    if (!data.company) {
        return { nodes: [], edges: [] };
    }

    const nodes = [];
    const edges = [];

    /* ---------------- COMPANY (TOP CENTER) ---------------- */
    const companyId = "company-root";
    
    // Calculate total width needed for first level to center company
    let firstLevelCount = 0;
    if (data.company.admin) firstLevelCount++;
    firstLevelCount += (data.independentSalesManagers?.length || 0);
    firstLevelCount += (data.independentTeamLeaders?.length || 0);
    firstLevelCount += (data.independentTeams?.length || 0);
    firstLevelCount += (data.independentExecutives?.length || 0);
    firstLevelCount += (data.groups?.length || 0);
    
    const firstLevelWidth = firstLevelCount * (NODE_WIDTH + H_GAP) - H_GAP;
    const companyX = firstLevelWidth / 2;
    
    nodes.push(
        createNode(companyId, "group", {
            name: data.company.name,
            type: "company"
        }, companyX, 0)
    );

    /* ---------------- FIRST LEVEL (Direct Company Reports) ---------------- */
    const firstLevelY = FIRST_LEVEL_V_GAP;
    let cursorX = 0;

    const attachToCompany = (nodeId) =>
        edges.push(createEdge(companyId, nodeId));

    /* ---------- 1. COMPANY ADMIN ---------- */
    if (data.company.admin) {
        const id = `admin-${data.company.admin.id}`;
        nodes.push(
            createNode(id, "user", {
                name: data.company.admin.name,
                designation: "Company Admin",
                systemRole: "company_admin"
            }, cursorX, firstLevelY)
        );
        attachToCompany(id);
        cursorX += NODE_WIDTH + H_GAP;
    }

    /* ---------- 2. GROUPS (First Level Placeholders) ---------- */
    const groupPlaceholders = [];
    if (data.groups && Array.isArray(data.groups)) {
        data.groups.forEach(group => {
            const groupId = `group-${group.id}`;
            groupPlaceholders.push({ groupId, x: cursorX });
            
            nodes.push(
                createNode(groupId, "group", { 
                    name: group.name,
                    type: "group"
                }, cursorX, firstLevelY)
            );
            attachToCompany(groupId);
            cursorX += NODE_WIDTH + H_GAP;
        });
    }

    /* ---------- 3. INDEPENDENT TEAMS ---------- */
    if (data.independentTeams && Array.isArray(data.independentTeams)) {
        data.independentTeams.forEach(team => {
            const teamId = `team-${team._id}`;

            // Calculate children width to center the team card
            let childrenCount = 0;
            if (team.leader) childrenCount++;
            childrenCount += (team.executives?.length || 0);
            
            const childrenWidth = childrenCount > 0 
                ? childrenCount * (NODE_WIDTH + H_GAP) - H_GAP 
                : 0;
            
            const teamX = childrenWidth > NODE_WIDTH 
                ? cursorX + (childrenWidth - NODE_WIDTH) / 2 
                : cursorX;

            nodes.push(
                createNode(teamId, "team", { 
                    name: team.name,
                    type: "team"
                }, teamX, firstLevelY)
            );
            attachToCompany(teamId);

            // Team children (leader and executives)
            let teamChildX = cursorX;
            const teamChildY = firstLevelY + V_GAP;

            // Add team leader if exists
            if (team.leader) {
                const leaderId = `iteam-leader-${team.leader}`;
                nodes.push(
                    createNode(leaderId, "user", {
                        name: "Team Leader",
                        designation: "Team Leader",
                        systemRole: "team_leader"
                    }, teamChildX, teamChildY)
                );
                edges.push(createEdge(teamId, leaderId));
                teamChildX += NODE_WIDTH + H_GAP;
            }

            // Add team executives if they exist
            if (team.executives && Array.isArray(team.executives)) {
                team.executives.forEach(exec => {
                    const execId = `iteam-exec-${exec._id}`;
                    nodes.push(
                        createNode(execId, "user", {
                            name: exec.name,
                            designation: "Sales Executive",
                            systemRole: "sales_executive"
                        }, teamChildX, teamChildY)
                    );
                    edges.push(createEdge(teamId, execId));
                    teamChildX += NODE_WIDTH + H_GAP;
                });
            }

            cursorX += Math.max(NODE_WIDTH, childrenWidth) + H_GAP;
        });
    }

    /* ---------- 4. INDEPENDENT SALES MANAGERS ---------- */
    if (data.independentSalesManagers && Array.isArray(data.independentSalesManagers)) {
        data.independentSalesManagers.forEach(sm => {
            const id = `sm-${sm._id}`;
            nodes.push(
                createNode(id, "user", {
                    name: sm.name,
                    designation: "Sales Manager",
                    systemRole: "sales_manager"
                }, cursorX, firstLevelY)
            );
            attachToCompany(id);
            cursorX += NODE_WIDTH + H_GAP;
        });
    }

    /* ---------- 5. INDEPENDENT TEAM LEADERS ---------- */
    if (data.independentTeamLeaders && Array.isArray(data.independentTeamLeaders)) {
        data.independentTeamLeaders.forEach(tl => {
            const id = `itl-${tl._id}`;
            nodes.push(
                createNode(id, "user", {
                    name: tl.name,
                    designation: "Team Leader",
                    systemRole: "team_leader"
                }, cursorX, firstLevelY)
            );
            attachToCompany(id);
            cursorX += NODE_WIDTH + H_GAP;
        });
    }

    /* ---------- 6. INDEPENDENT EXECUTIVES ---------- */
    if (data.independentExecutives && Array.isArray(data.independentExecutives)) {
        data.independentExecutives.forEach(exec => {
            const id = `iexec-${exec._id}`;
            nodes.push(
                createNode(id, "user", {
                    name: exec.name,
                    designation: "Sales Executive",
                    systemRole: "sales_executive"
                }, cursorX, firstLevelY)
            );
            attachToCompany(id);
            cursorX += NODE_WIDTH + H_GAP;
        });
    }

    /* ---------------- GROUPS DETAILS (Second Level) ---------------- */
    const groupY = firstLevelY + V_GAP * 2.5;

    groupPlaceholders.forEach(({ groupId, x: groupFirstLevelX }) => {
        const group = data.groups.find(g => `group-${g.id}` === groupId);
        if (!group) {
            return;
        }

        let childX = groupFirstLevelX;
        const childY = groupY;

        /* --- Group Manager --- */
        if (group.manager) {
            const mid = `gm-${group.manager._id}`;
            nodes.push(
                createNode(mid, "user", {
                    name: group.manager.name,
                    designation: "Sales Manager",
                    systemRole: "sales_manager"
                }, childX, childY)
            );
            edges.push(createEdge(groupId, mid));
            childX += NODE_WIDTH + H_GAP;
        }

        /* --- Teams in Group --- */
        if (group.teams && Array.isArray(group.teams)) {
            group.teams.forEach(team => {
                const teamId = `team-${team.id}`;

                nodes.push(
                    createNode(teamId, "team", { 
                        name: team.name,
                        type: "team"
                    }, childX, childY)
                );
                edges.push(createEdge(groupId, teamId));

                let teamChildX = childX;
                const teamChildY = childY + V_GAP;

                // Team Leader
                if (team.leader) {
                    const leaderId = `leader-${team.leader._id}`;
                    nodes.push(
                        createNode(leaderId, "user", {
                            name: team.leader.name,
                            designation: "Team Leader",
                            systemRole: "team_leader"
                        }, teamChildX, teamChildY)
                    );
                    edges.push(createEdge(teamId, leaderId));
                    teamChildX += NODE_WIDTH + H_GAP;
                }

                // Team Executives
                if (team.executives && Array.isArray(team.executives)) {
                    team.executives.forEach(exec => {
                        const eid = `exec-${exec._id}`;
                        nodes.push(
                            createNode(eid, "user", {
                                name: exec.name,
                                designation: "Sales Executive",
                                systemRole: "sales_executive"
                            }, teamChildX, teamChildY)
                        );
                        edges.push(createEdge(teamId, eid));
                        teamChildX += NODE_WIDTH + H_GAP;
                    });
                }

                childX += Math.max(NODE_WIDTH, teamChildX - childX) + H_GAP;
            });
        }
    });

    /* ---------------- RESOLVE OVERLAPS ---------------- */
    const adjustedNodes = resolveOverlaps(nodes);

    return { nodes: adjustedNodes, edges };
};