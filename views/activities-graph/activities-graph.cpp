#include <bits/stdc++.h>

std::ifstream cin("input.txt");
std::ofstream cout("graph.json");

struct edge{
	char source[4], target[4], id[4];
};

struct activity
{
	int start, end, gain;
};

int main()
{

	std::vector<activity> activities;
	std::vector<edge> edges;
	activity tmp;

	tmp.start = 0;
	tmp.end = 0;
	tmp.gain = 0;
	activities.push_back(tmp); //esta actividad representa el estado en el que no se asigando ninguna actividad

	while(cin >> tmp.start){
		cin >> tmp.end >> tmp.gain;
		activities.push_back(tmp);
	}

	edge tm;
	char buf[10];
	int n = activities.size();
	for (int i = 0; i < n; ++i)
	{
		for (int j = 0; j < n; ++j)
		{
			if(activities.at(j).start >= activities.at(i).end){
				strcpy(tm.source, "n");
				itoa(i,buf,10);
				strcat(tm.source,buf);
				strcpy(tm.target, "n");
				itoa(i,buf,10);
				strcat(tm.target,buf);
				itoa(n*i+j,buf,10);
				strcpy(tm.id,"e");
				strcat(tm.id,buf);
				edges.push_back(tm); 
			}
		}
	}

	int x = 3, y = 1;
	cout << "{\n\t\"nodes\": [";
	for (int i = 0; i < n; ++i)
	{	
		cout << "\n\t{\n\t\t\"id\":\"n" << i << "\",";
		cout << "\n\t\t\"label\":\"" << i << "\",";
		cout << "\n\t\t\"x\":\"" << x << "\",";
		cout << "\n\t\t\"y\":\"" << y << "\",";
		cout << "\n\t\t\"size\":\"" << activities.at(i).gain << "\"\n\t}";
		if(i < n - 1)
			cout << ",";
		y++;
	}
	cout << "\n\t],";

	cout << "\n\t\"edges\": [";
	for (int i = 0; i < edges.size(); ++i)
	{	
		cout << "\n\t{\n\t\t\"id\":\"" << edges.at(i).id << "\",";
		cout << "\n\t\t\"source\":\"" << edges.at(i).source << "\",";
		cout << "\n\t\t\"target\":\"" << edges.at(i).target << "\"\n\t}";
		if(i < edges.size() - 1)
			cout << ",";
	}
	cout << "\n\t]\n}";
	

	return 0;
}